import RSVP from 'rsvp';
import patcher from './ext/jsonpatcher';

const diffPatcher = patcher.create({});

import mixin from './util/mixin';
import emittableMixin from './mixin/emittable';

import XFlowStruct from './xflow-struct';
import {
  isSameEdge,
  isTerminalNode,
  getEntryNode,
  getNode,
} from './util/flow';

import {
  exists,
  mergeDict,
  clone,
} from './util/lang';

const initVariables = (vars) => {
  const dict = {};
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

};

const initState = (params) => {
  const state = {};
  for (const key in params) {
    state[key] = params[key];
  }
  return state;
};

const getSelectedEdge = (node, flow, state) => {

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
      isSameEdge(edge, resBranches[0].edge)
  );

  if (resEdges.length > 1) {
    throw new Error('xflow.getNextNodeFromBranch : Multiple matching edges found');
  } else if (resEdges.length < 1) {
    throw new Error('xflow.getNextNodeFromBranch : No matching edges found');
  }

  return resEdges[0];
};

const getNextNode = (node, flow, state) => {
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

};

const getReturnValue = (retVals, state) => {
  if (!exists(state)) {
    throw new Error('getReturnValue : NO STATE');
  }

  const retObj = {};
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
};

/**
 * XFlow
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
   * @param {XFlowDispatcher} dispatcher Dispatcher
   * @param {Object} id (optional) Flow ID
   * @example
   *     var xflow = new XFlow({}, {}, new XFlowDispatcher());
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
     * @type {Number}
     */
    this.id = id || +(new Date());

    /**
     * Flow data
     * @property flow
     * @type {XFlowStruct}
     */
    this.flow = new XFlowStruct(flowJson);

    /**
     * Flow version
     * @property version
     */
    this.version = flowJson.version;
    this.dispatcher = dispatcher;
    this.stateDiffs = [];
    this.transitions = [];

    this.state = mergeDict(
      initState(params),
      initVariables(this.flow.getLocalVariables()),
      initVariables(this.flow.getInVariables())
    );

    this.initEmittable();

    this.activeNode = getEntryNode(this.flow.getNodes());

  }

  /**
   * Return a clone of this.state
   * @method cloneState
   * @private
   * @return {Object}
   */
  cloneState() {
    return clone(this.state);
  }

  /**
   * Return a clone of this.state
   * @method setState
   * @private
   * @param {Object} state
   */
  setState(state) {
    const deltas = diffPatcher.diff(this.state, state);
    if (deltas.length > 0) {
      // console.log('deltas is ', JSON.stringify(deltas));
      /**
       * Fired when state changes, delta supplied in JSON-PATCH format
       * @event change
       * @param {String} id
       * @param {Array} deltas
       */
      this.emit('change', deltas);
      this.stateDiffs.push([this.activeNode.id, deltas]);
      this.state = state;
    }
  }

  /**
   * Set the current node to process to <node>
   * @method setActiveNode
   * @param {Object} node
   */
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
      this.flow.getOutVariables(),
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
   * @example
   *     xflow.nextStep() // [true|false]
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
   * @example
   *     xflow.startQ().then(
   *       (ok) => {
   *         console.log('Flow completed ', ok);
   *       },
   *       (err) => {
   *         console.log('Flow error ', err);
   *       }
   *     );
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
   * @example
   *     xflow.nextStepQ().then(
   *       (hasNext) => {
   *         console.log('Flow step completed. Is there a next step ? ', hasNext);
   *       },
   *       (err) => {
   *         console.log('Flow error ', err);Y
   *       }
   *     );
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

  /**
   * Save the current XFlow state in a JSON object
   * @method save
   * @return {Object}
   * @example
   *     xflow.save();
   */
  save() {
    return clone({
      id: this.id,
      stateDiffs: this.stateDiffs,
      transitions: this.transitions,
      state: this.state,
      activeNodeId: this.activeNode.id,
    });
  }

  /**
   * Restore a saved state into this XFlow instance
   * @method restore
   * @param {Object} savedState
   * @throws {Error} If the state active node is invalid
   * @example
   *     xflow.restore(savedState);
   */
  restore(stt) {
    this.id = stt.id;
    this.stateDiffs = stt.stateDiffs;
    this.transitions = stt.transitions;
    this.state = stt.state;
    this.activeNode = this.flow.getNode(stt.activeNodeId);
  }

}

mixin(XFlow, emittableMixin);

export default XFlow;
