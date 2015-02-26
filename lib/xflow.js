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

function mergeDict(a, b) {
  for (var keyB in b) {
    if (!exists(a[keyB])) {
      a[keyB] = b[keyB];
    }
  }
  return a;
}

function initVariables(vars) {
  var dict = {};
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
  var state = {};
  for (var key in params) {
    state[key] = params[key];
  }
  return state;
}

function isSameEdge(a, b) {
  return (
    (a[0] === b[0]) &&
      (a[1] === b[1])
  );
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
      throw new Error('Multiple nodes with ID found : ' + id);
    }
    if (resNodes.length < 1) {
      throw new Error('No node with ID found : ' + id);
    }
  }

  return resNodes[0];
}

function getSelectedEdge(node, flow, state) {

  var resBranches = flow.branches.filter(
    (branch) =>
      branch.name === node.parameters.name &&
        branch.value === state[node.parameters.name]
  );

  if (resBranches.length > 1) {
    throw new Error('xflow.getNextNodeFromBranch : Multiple matching branches found');
  } else if (resBranches.length < 1) {
    throw new Error('xflow.getNextNodeFromBranch : No matching branches found');
  }

  var resEdges = flow.edges.filter(
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
  var resEdges = flow.edges.filter(
    (edge) =>
      edge[0] === node.id
  );

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
      (state) => {
        // console.log('processNodeQ - resolve', res);
        defer.resolve(state);
      },
      (err) => {
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

    if (!!!flowJson.data) {
      throw new Error('xflowExecutor : No valid flow data found');
    }

    this.flow  = flowJson.data;
    this.state = mergeDict(
      initState(params),
      initVariables(this.flow.variables)
    );

  }

  //
  // Sync methods
  //

  start() {
    return this._runToCompletion(
      getEntryNode(this.flow.nodes)
    );
  }

  _runToCompletion(node) {

    while (!isTerminalNode(node)) {
      node = getNextNode(
        node,
        this.flow,
        this.state
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

    try {
      this._runToCompletionQ(
        getEntryNode(this.flow.nodes),
        this.state
      ).then(
        (state) => {
          console.log('startFlowQ: Resolved ', state);
          this.state = state;
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
    var defer = RSVP.defer();

    var nextStep = ()=> {
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
        console.log('calling with state ', this.state);
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
