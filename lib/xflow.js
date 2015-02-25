import RSVP from 'rsvp';

import FlowActions from './flow_actions';

var FlowNodeDispatch      = FlowActions.FlowNodeDispatch;
var FlowNodeDispatchQ     = FlowActions.FlowNodeDispatchQ;

var ObjectNodeDispatch    = FlowActions.ObjectNodeDispatch;
var ObjectNodeDispatchQ   = FlowActions.ObjectNodeDispatchQ;

// var ListNodeDispatch      = FlowActions.ListNodeDispatch;
// var ListNodeDispatchQ     = FlowActions.ListNodeDispatchQ;

function exists(val) {
  return (
    (val !== null) &&
    (val !== undefined)
  );
}

function hasProperty(obj, prop) {
  var steps = prop.split('.');
  var stepObj = obj;
  var step;

  while (steps.length) {
    step = steps.shift();

    if (!exists(stepObj[step])) {
      return false;
    } else {
      stepObj = obj[step];
    }
  }
  return true;
}

function initState(params) {
  var state = {};
  for (var key in params) {
    state[key] = params[key];
  }
  return state;
}

function isTerminalNode(node) {
  return (
    (node.type === 'flow') &&
    (node.action === 'end')
  );
}

function getEntryNode(nodes) {
  var resNodes = nodes.filter(
    (node) =>
      node.type === 'flow' &&
      node.action === 'start'
  );

  if (resNodes.length !== 1) {
    if (resNodes.length > 1) {
      throw new Error('Multiple entry nodes found');
    }
    if (resNodes.length < 1) {
      throw new Error('No entry node found');
    }
  }

  return resNodes[0];
}

function getNode(id, nodes) {
  var resNodes = nodes.filter(
    (node) =>
      node.id === id
  );

  if (resNodes.length !== 1) {
    if (resNodes.length > 1) {
      throw new Error('Multiple nodes with ID found');
    }
    if (resNodes.length < 1) {
      throw new Error('No node with ID found');
    }
  }

  return resNodes[0];
}

function getNextNode(node, nodes, edges) {
  // console.log('getNextNode ', JSON.stringify(node));
  var resEdges = edges.filter(
    (edge) =>
      edge[0] === node.id
  );

  if (resEdges.length > 1) {

    //
    // TODO : Branching condition
    //

    throw new Error('Multiple edges found');
  }

  if (resEdges.length === 1) {
    return getNode(resEdges[0][1], nodes);
  } else {
    return null;
  }

}

function getReturnValue(signature, state) {
  if (!!!state) {
    throw new Error('getReturnValue : NO STATE');
  }
  console.log('getReturnValue : ', signature , ' // ' , state);
  return signature.map(
    (obj) => {
      var retObj = {};
      if (state[obj.name]) {
        retObj[obj.name] = state[obj.name];
      }
      return retObj;
    });
}

function processNodeQ(node, state) {
  var defer = RSVP.defer();

  var promise;
  switch(node.type) {
  case 'object':
    // console.log('processNodeQ : type object');
    promise = ObjectNodeDispatchQ(node, state);
    break;
  case 'flow':
    // console.log('processNodeQ : type flow');
    promise = FlowNodeDispatchQ(node, state);
    break;
  default:
    defer.reject('No handler for node type ', node.type);
  }

  if (exists(promise)) {
    promise.then(
      function(state) {
        // console.log('processNodeQ - resolve', res);
        defer.resolve(state);
      },
      function(err) {
        console.error('processNodeQ error ', err);
        defer.reject(err);
      }
    );
  }

  return defer.promise;
}

function processNode(node, state) {
  switch(node.type) {
  case 'object':
    state = ObjectNodeDispatch(node, state);
    break;
  case 'flow':
    state = FlowNodeDispatch(node, state);
    break;
  default:
    throw new Error('No handler for node type ', node.type);
  }
  return state;
}

class xflowExecutor {

  constructor(flowJson, params) {
    this.flow  = flowJson.data;
    this.state = initState(params);

    if (!!!this.flow) {
      throw new Error('xflowExecutor : No valid flow data found');
    }
  }

  //
  // Sync methods
  //

  start() {
    return this._runToCompletion(
      getEntryNode(this.flow.nodes),
      this.state
    );
  }

  _runToCompletion(node, state) {

    while (!isTerminalNode(node)) {
      // console.log('_runToCompletion, stepping');
      node = getNextNode(node,
        this.flow.nodes,
        this.flow.edges
      );
      this.state = processNode(node, this.state);
    }

    return getReturnValue(
      this.flow.signature.out,
      this.state
    );

  }

  //
  // Async methods
  //

  startQ() {
    var defer = RSVP.defer();

    this._runToCompletionQ(
      getEntryNode(this.flow.nodes),
      this.state
    ).then(
      (res) => {
        console.log('startFlowQ: Resolved ', res);
        defer.resolve(res);
      },
      (err) => {
        console.error('startFlowQ: Rejected ', err);
        defer.reject(err);
      }
    );

    return defer.promise;
  }

  _runToCompletionQ(node) {
    console.log('_runToCompletionQ');
    var defer = RSVP.defer();

    var nextStep = ()=> {
      node = getNextNode(node,
        this.flow.nodes,
        this.flow.edges
      );
      if (isTerminalNode(node)) {
        defer.resolve(
          getReturnValue(
            this.flow.signature.out,
            this.state
          ));
      } else {
        processNodeQ(node, this.state).then(
          (state) => {
            this.state = state;
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

export default xflowExecutor;
