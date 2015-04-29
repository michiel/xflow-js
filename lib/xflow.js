import RSVP          from 'rsvp';
import EventEmitter2 from 'eventemitter2';
import jsondiffpatch from 'jsondiffpatch';

const diffPatcher = jsondiffpatch.create({});

import XFlowStruct from './xflow-struct';
import FlowUtil    from './util/flow';
import LangUtil    from './util/lang';

const exists         = LangUtil.exists;
const mergeDict      = LangUtil.mergeDict;
const isSameEdge     = FlowUtil.isSameEdge;
const isTerminalNode = FlowUtil.isTerminalNode;
const getEntryNode   = FlowUtil.getEntryNode;
const getNode        = FlowUtil.getNode;

function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function initVariables(vars) {
  let dict = {};
  vars.forEach(
    (obj) => {
      let val;
      switch (obj.vtype) {
        case 'number':
          val = obj.value || 0;
        break;
        case 'boolean':
          val = obj.value || false;
        break;
        case 'string':
          val = obj.value || '';
        break;
        default:
          throw new Error(
            `xflow.initVariables : Unhandled type ${obj.vtype}`
          );
      }

      if (exists(dict[obj.name])) {
        throw new Error(
          `xflow.initVariables : multiple declarations of variable ${obj.name}`
        );
      }

      dict[obj.name] = val;
    });
  return dict;

}

function initState(params) {
  let state = {};
  for (let key in params) {
    state[key] = params[key];
  }
  return state;
}

function getSelectedEdge(node, flow, state) {

  const resBranches = flow.getBranches().filter(
    (branch) =>
      branch.name === node.parameters.name &&
        branch.value === state[node.parameters.name]
  );

  if (resBranches.length > 1) {
    throw new Error('xflow.getNextNodeFromBranch : Multiple matching branches found');
  } else if (resBranches.length < 1) {
    throw new Error('xflow.getNextNodeFromBranch : No matching branches found');
  }

  const resEdges = flow.getEdges().filter(
    (edge) =>
      isSameEdge(edge, resBranches[0].branch)
  );

  if (resEdges.length > 1) {
    throw new Error('xflow.getNextNodeFromBranch : Multiple matching edges found');
  } else if (resEdges.length < 1) {
    throw new Error('xflow.getNextNodeFromBranch : No matching edges found');
  }

  return resEdges[0];
}

function getNextNode(node, flow, state) {
  // console.log('getNextNode ', JSON.stringify(node));
  const resEdges = flow.getEdges().filter(
    (edge) =>
      edge[0] === node.id
  );

  //
  // 1. Next node
  // 2. Next node from branch condition
  // 3. No next node
  //

  if (resEdges.length === 1) {
    return getNode(resEdges[0][1], flow.getNodes());
  } else if (resEdges.length > 1) {
    return getNode(
      getSelectedEdge(node, flow, state)[1],
      flow.getNodes()
    );
  } else {
    return null;
  }

}

function getReturnValue(retVals, state) {
  if (!exists(state)) {
    throw new Error('getReturnValue : NO STATE');
  }

  let retObj = {};
  retVals.forEach(
    (obj) => {
      if (exists(state[obj.name])) {
        retObj[obj.name] = state[obj.name];
      } else {
        const stt = JSON.stringify(state);
        console.log(
          `XFlow.getReturnValue : Looking for value ${obj.name} but not found in scope : ${stt}`
        );
      }
    }
  );
  return retObj;
}

/**
 * XFlow class.
 * @class XFlow
 * @event XFlow#start
 * @event XFlow#end
 * @event XFlow#nextStep
 */
class XFlow {


  /**
   * XFlow constructor
   * @class XFlow
   * @constructor XFlow
   * @param {Object} flowJson Flow JSON
   * @param {Object} params Initial parameter hash
   * @param {Object} dispatcher Dispatcher
   * @param {Object} id (optional) Flow ID
   */
  constructor(flowJson, params, dispatcher, id) {

    /* jshint maxstatements:50 */

    if (!exists(flowJson)) {
      throw new Error('XFlow : No valid flow data found');
    }

    params = params || {};

    if (!exists(dispatcher)) {
      throw new Error('XFlow : Initialized without a dispatcher');
    }


    /**
     * Flow ID
     * @property id
     */
    this.id          = id || +(new Date());

    this.flow        = new XFlowStruct(flowJson);

    /**
     * Flow version
     * @property version
     */
    this.version     = flowJson.version;
    this.dispatcher  = dispatcher;
    this.stateDiffs  = [];
    this.transitions = [];

    this.state      = mergeDict(
      initState(params),
      initVariables(this.flow.getVariables().local),
      initVariables(this.flow.getVariables().in)
    );

    /**
     * Event emitter
     * @property emitter
     */
    const EmitC  = EventEmitter2.EventEmitter2 || EventEmitter2;
    this.emitter = new EmitC({
      wildcard : true
    });

    this.activeNode = getEntryNode(this.flow.getNodes());

  }

  emit(name, ...args) {
    this.emitter.emit.apply(
      this.emitter,
      [name, this.id].concat(...args)
    );
  }

  cloneState() {
    return cloneObject(this.state);
  }

  setState(state) {
    const delta = diffPatcher.diff(this.state, state);
    if (exists(delta)) {
      /**
       * Fired when state changes, delta supplied in JSON-PATCH format
       * @event stateChange
       * @param {String} id
       * @param {Object} delta
       */
      this.emit('stateChange', delta);
      this.stateDiffs.push([this.activeNode.id, delta]);
      this.state = state;
    }
  }

  setActiveNode(node) {
    if (node.id === this.activeNode.id) {
      throw new Error(
        `XFlow.setActiveNode : nodes are the same ${node.id}`
      );
    } else {
      this.emit('step', node.id);
      this.transitions.push([this.activeNode.id, node.id]);
      this.activeNode = node;
    }
  }

  stepToNextNode() {
    /**
     * @event next
     * @param {String} id
     * @param {String} Current node ID
     */
    this.setActiveNode(
      getNextNode(
        this.activeNode,
        this.flow,
        this.state
      )
    );
    this.emit('next', this.activeNode.id);
  }

  returnValue() {
    return getReturnValue(
      this.flow.getVariables().out,
      this.state
    );
  }

  /**
   * Starts the flow
   * @method start
   * @return {Object} Flow return value
   */
  start() {
    /**
     * @event start
     * @param {String} id
     */
    this.emit('start');

    let hasNext = true;

    while (hasNext) {
      hasNext = this.nextStep();
    }

    return this.returnValue();

  }

  /**
   * Executes the next step
   * @method nextStep
   * @return {Boolean} Returns true if there was a next step to execute
   */
  nextStep() {

    if (isTerminalNode(this.activeNode)) {

      this.emit('end');
      return false;

    } else {

      this.stepToNextNode();

      this.setState(
        this.dispatcher.processNode(
          this.activeNode,
          this.cloneState()
        )
      );

      return true;
    }

  }

  /**
   * Start flow async
   * @method startQ
   * @return {Promise} Resolves the final state
   */
  startQ() {
    const defer = RSVP.defer();

    this.emit('start');

    const nextLoop = () => {
      this.nextStepQ().then(
        (hasNext)=> {
          if (hasNext) {
            nextLoop();
          } else {
            defer.resolve(this.returnValue());
          }
        },
        (err)=> {
          console.error('XFlow.startQ : error ', err);
          defer.reject('XFlow.startQ : error ' + err);
        }
      );
    };

    nextLoop();

    return defer.promise;
  }

  /**
   * Executes the next step
   * @method nextStepQ
   * @return {Promise} Resolves a Boolean, true if there was a next step to execute
   */
  nextStepQ() {
    const defer = RSVP.defer();

    this.emit('next', this.activeNode.id);

    if (isTerminalNode(this.activeNode)) {
      this.emit('end');
      defer.resolve(false);
    } else {

      this.stepToNextNode();

      this.dispatcher.processNodeQ(
        this.activeNode,
        this.cloneState()
      ).then(
        (state)=> {
          this.setState(state);
          defer.resolve(true);
        },
        (err)=> {
          defer.reject(err);
        }
      );

    }
    return defer.promise;
  }

}

export default XFlow;
