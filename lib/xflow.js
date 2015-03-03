import RSVP from 'rsvp';
import EventEmitter2 from 'eventemitter2';

const EM = EventEmitter2.EventEmitter2;

import FlowActions from './flow_actions';
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
      var val;
      switch(obj.type) {
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
  constructor(flowJson, params, dispatcher) {

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
    this.id         = +(new Date());
    this.flow       = flowJson;
    this.dispatcher = dispatcher;
    this.state      = mergeDict(
      initState(params),
      initVariables(this.flow.variables)
    );

    this.emitter = new EM({
      wildcard : true
    });

  }

  emit(name, ...args) {
    this.emitter.emit.apply(
      this.emitter,
      [name, this.id].concat(...args)
    );
  }

  //
  // Sync methods
  //

  /**
   * Starts the flow
   * @method XFlow#start
   * @returns {Object} state
   */
  start() {
    this.emit('start');
    return this._runToCompletion(
      getEntryNode(this.flow.nodes)
    );
  }

  _runToCompletion(node) {

    while (!isTerminalNode(node)) {
      this.emit('nextStep', node.id);
      node = getNextNode(
        node,
        this.flow,
        this.state
      );
      this.state = this.dispatcher.processNode(node, this.state);
    }

    this.emit('end');
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
   * @returns {Promise} Resolves the final state
   */
  startQ() {
    const defer = RSVP.defer();

    this.emit('start');

    try {
      this._runToCompletionQ(
        getEntryNode(this.flow.nodes)
      ).then(
        (state) => {
          console.log('startFlowQ: Resolved ', state);
          this.state = state;
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

  _runToCompletionQ(node) {
    const defer = RSVP.defer();

    const nextStep = (node) => {
      this.emit('nextStep', node.id);
      node = getNextNode(
        node,
        this.flow,
        this.state
      );
      if (isTerminalNode(node)) {
        defer.resolve(
          getReturnValue(
            this.flow.signature.out,
            this.state
          ));
      } else {
        this.dispatcher.processNodeQ(node, this.state).then(
          (state) => {
            this.state = state;
            nextStep(node);
          },
          (err) => {
            console.error('runToCompletionQ.nextStep : error ', err);
            defer.reject('runToCompletionQ.nextStep : error ' + err);
          }
        );
      }
    };

    nextStep(node);

    return defer.promise;
  }
}

export default XFlow;
