import RSVP from 'rsvp';
import EventEmitter2 from 'eventemitter2';

const EM = EventEmitter2.EventEmitter2;

import flowUtil from './flow-util';

const exists         = flowUtil.exists;
const hasProperty    = flowUtil.hasProperty;
const mergeDict      = flowUtil.mergeDict;
const isSameEdge     = flowUtil.isSameEdge;
const isTerminalNode = flowUtil.isTerminalNode;
const getEntryNode   = flowUtil.getEntryNode;
const getNode        = flowUtil.getNode;

function initVariables(vars) {
  let dict = {};
  vars.forEach(
    (obj) => {
      let val;
      switch (obj.type) {
        case 'number':
          val = 0;
        break;
        case 'boolean':
          val = false;
        break;
        case 'string':
          val = '';
        break;
        default:
          throw new Error('xflox.initVariables : Unhandled type ' + obj.type);
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

  const resBranches = flow.branches.filter(
    (branch) =>
      branch.name === node.parameters.name &&
        branch.value === state[node.parameters.name]
  );

  if (resBranches.length > 1) {
    throw new Error('xflow.getNextNodeFromBranch : Multiple matching branches found');
  } else if (resBranches.length < 1) {
    throw new Error('xflow.getNextNodeFromBranch : No matching branches found');
  }

  const resEdges = flow.edges.filter(
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
  const resEdges = flow.edges.filter(
    (edge) =>
      edge[0] === node.id
  );

  //
  // 1. Next node
  // 2. Next node from branch condition
  // 3. No next node
  //

  if (resEdges.length === 1) {
    return getNode(resEdges[0][1], flow.nodes);
  } else if (resEdges.length > 1) {
    return getNode(
      getSelectedEdge(node, flow, state)[1],
      flow.nodes,
      state
    );
  } else {
    return null;
  }

}

function getReturnValue(signature, state) {
  if (!!!state) {
    throw new Error('getReturnValue : NO STATE');
  }
  // console.log('getReturnValue : ', signature , ' // ' , state);
  return signature.map(
    (obj) => {
      let retObj = {};
      if (state[obj.name]) {
        retObj[obj.name] = state[obj.name];
      }
      return retObj;
    });
}

/**
 * XFlow class.
 * @class XFlow
 * @fires XFlow#start
 * @fires XFlow#end
 * @fires XFlow#nextStep
 */
class XFlow {


  /**
   * XFlow constructor
   * @constructor XFlow
   * @param {Object} flowJson
   * @param {Object} params
   */
  constructor(flowJson, params, dispatcher, id) {

    if (!!!flowJson) {
      throw new Error('XFlow : No valid flow data found');
    }

    params = params || {};

    if (!!!dispatcher) {
      throw new Error('XFlow : Initialized without a dispatcher');
    }


    /**
     * Flow ID
     * @member XFlow#id
     */
    this.id         = id || +(new Date());
    this.flow       = flowJson;
    this.dispatcher = dispatcher;

    this.state      = mergeDict(
      initState(params),
      initVariables(this.flow.variables),
      initVariables(this.flow.signature.in)
    );

    this.emitter    = new EM({
      wildcard : true
    });

    this.activeNode = getEntryNode(this.flow.nodes);
    this.stepCount  = 0;

  }

  emit(name, ...args) {
    this.emitter.emit.apply(
      this.emitter,
      [name, this.id].concat(...args)
    );
  }

  setState(state) {
    this.state = state;
  }

  setActiveNode(node) {
    this.activeNode = node;
  }

  //
  // Sync methods
  //

  /**
   * Starts the flow
   * @method XFlow#start
   * @return {Object} state
   */
  start() {
    /**
     * @event start
     */
    this.emit('start');

    while (!isTerminalNode(this.activeNode)) {
      /**
       * @event nextStep
       * @param {String} Current node ID
       */
      this.emit('nextStep', this.activeNode.id);
      this.stepCount++;

      this.setActiveNode(
        getNextNode(
          this.activeNode,
          this.flow,
          this.state
        )
      );

      this.setState(
        this.dispatcher.processNode(
          this.activeNode,
          this.state
        )
      );
    }

    /**
     * @event end
     */
    this.emit('end');

    return getReturnValue(
      this.flow.signature.out,
      this.state
    );

  }

  nextStep() {
    this.emit('nextStep', this.activeNode.id);

    if (isTerminalNode(this.activeNode)) {

      this.emit('end');
      return false;

    } else {

      this.setActiveNode(
        getNextNode(
          this.activeNode,
          this.flow,
          this.state
        )
      );

      this.stepCount++;

      this.setState(
        this.dispatcher.processNode(
          this.activeNode,
          this.state
        )
      );

      return true;
    }

  }

  nextStepQ() {
    const defer = RSVP.defer();

    this.emit('nextStep', this.activeNode.id);

    if (isTerminalNode(this.activeNode)) {

      this.emit('end');
      defer.resolve(false);

    } else {

      this.setActiveNode(
        getNextNode(
          this.activeNode,
          this.flow,
          this.state
        )
      );

      this.stepCount++;

      this.dispatcher.processNodeQ(
        this.activeNode,
        this.state
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

  returnValue() {
    return getReturnValue(
      this.flow.signature.out,
      this.state
    );
  }

  //
  // Async methods
  //

  /**
   * Start flow async
   * @method XFlow#startQ
   * @return {Promise} Resolves the final state
   */
  startQ() {
    const defer = RSVP.defer();

    this.emit('start');

    try {
      this._runToCompletionQ().then(
        (state) => {
          this.emit('xflow.resolved', state);
          // console.log('startFlowQ: Resolved ', state);
          this.setState(state);
          this.emit('end');
          defer.resolve(state);
        },
        (err) => {
          console.error('startFlowQ: Rejected ', err);
          defer.reject(err);
        }
      );
    } catch(e) {
      defer.reject(e.message);
    }

    return defer.promise;
  }

  _runToCompletionQ() {
    const defer = RSVP.defer();

    const nextStep = () => {
      this.emit('nextStep', this.activeNode.id);
      this.stepCount++;

      this.setActiveNode(
        getNextNode(
          this.activeNode,
          this.flow,
          this.state
        )
      );

      if (isTerminalNode(this.activeNode)) {
        defer.resolve(
          getReturnValue(
            this.flow.signature.out,
            this.state
          ));
      } else {
        this.dispatcher.processNodeQ(this.activeNode, this.state).then(
          (state) => {
            this.setState(state);
            nextStep();
          },
          (err) => {
            console.error('runToCompletionQ.nextStep : error ', err);
            defer.reject('runToCompletionQ.nextStep : error ' + err);
          }
        );
      }
    };

    nextStep();

    return defer.promise;
  }

}

export default XFlow;
