import RSVP from 'rsvp';

import FlowActions from './flow_actions';

var FlowNodeDispatch      = FlowActions.FlowNodeDispatch;
var FlowNodeDispatchQ     = FlowActions.FlowNodeDispatchQ;

var ObjectNodeDispatch    = FlowActions.ObjectNodeDispatch;
var ObjectNodeDispatchQ   = FlowActions.ObjectNodeDispatchQ;

// var ListNodeDispatch      = FlowActions.ListNodeDispatch;
// var ListNodeDispatchQ     = FlowActions.ListNodeDispatchQ;

function hasProperty(obj, prop) {
  var steps = prop.split('.');
  var stepObj = obj;
  var step;

  while (steps.length) {
    step = steps.shift();

    if (
      (stepObj[step] !== null) &&
      (typeof(stepObj[step]) !== 'undefined')
    ) {
      return false;
    } else {
      stepObj = obj[step];
    }
  }
  return true;
}

function isTerminalNode(node) {
  return (
    (node.type === 'flow') &&
    (node.action === 'end')
  );
}

function getEntryNode(nodes) {
  var resNodes = nodes.filter(
    node =>
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
    node =>
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
  console.log('getNextNode ', JSON.stringify(node));
  var resEdges = edges.filter(
    edge =>
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
      var retObj       = { };
      if (state[obj.name]) {
        retObj[obj.name] = state[obj.name];

        // console.log('X4! ', obj.name);
        // console.log('X4! ', state[obj.name]);

        //
        // XXX: Type checking
        //

        return retObj;
      }
      return retObj;
    });
}

function xflowExecutor(flowJson, params) {

  params = params || {};

  //
  // Re-instantiable from json(schema) object
  //

  var flow  = flowJson.data;

  if (!!!flow) {
    throw new Error('xflowExecutor : No valid data found');
  }

  //
  // Serializable hash
  //

  var state = JSON.parse(
    JSON.stringify(params)
  );

  function initState(vars) {
    var state = {};
    vars.map((obj)=> {
      state[obj.name] = obj.value;
    });
    return state;
  }

  //
  // sync
  //

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

  function runToCompletion(node, state) {
    while (!isTerminalNode(node)) {
      console.log('runToCompletion, stepping');
      node = getNextNode(node, flow.nodes, flow.edges);
      state = processNode(node, state);
    }

    return getReturnValue(
      flow.signature.out,
      state
    );
  }

  function startFlow() {
    return runToCompletion(
      getEntryNode(flow.nodes),
      initState(flow.variables)
    );
  }

  //
  // async
  //

  function processNodeQ(node) {
    var defer = RSVP.defer();

    var promise = null;
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

    promise.then(
      function(res) {
        // console.log('processNodeQ - resolve', res);
        defer.resolve(res);
      },
      function(err) {
        console.error('processNodeQ error ', err);
        defer.reject(err);
      }
    );

    return defer.promise;
  }

  function runToCompletionQ(node) {
    console.log('runToCompletionQ');
    var defer = RSVP.defer();

    function nextStep() {
      // console.log('nextStep');
      node = getNextNode(node, flow.nodes, flow.edges);
      if (isTerminalNode(node)) {
        // console.log('runToCompletionQ.nextStep : terminal node - resolving');
        defer.resolve(getReturnValue(
            flow.signature.out,
            state
          ));
      } else {
        // console.log('runToCompletionQ.nextStep : non terminal node - starting processing');
        processNodeQ(node).then(
          function() {
            // console.log('runToCompletionQ.nextStep : then - next');
            nextStep();
          },
          function(err) {
            // console.error('runToCompletionQ.nextStep : error ', err);
            defer.reject('runToCompletionQ.nextStep : error ' + err);
          }
        );
      }
    }

    nextStep();

    return defer.promise;
  }

  function startFlowQ() {
    var defer = RSVP.defer();

    runToCompletionQ(
      getEntryNode(flow.nodes),
      initState(flow.variables)
    ).then(
      function(res) {
        console.log('startFlowQ: Resolved ', res);
        defer.resolve(res);
      },
      function(err) {
        console.error('startFlowQ: Rejected ', err);
        defer.reject(err);
      }
    );

    return defer.promise;
  }

  return {
    start  : startFlow,
    startQ : startFlowQ
  };

}

export default xflowExecutor;
