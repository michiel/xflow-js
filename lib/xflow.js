var tv4  = require('tv4');
var RSVP = require('rsvp');

var FlowActions = require('./flow_actions');

var FlowNodeDispatch      = FlowActions.FlowNodeDispatch;
var FlowNodeDispatchQ     = FlowActions.FlowNodeDispatchQ;
var ObjectNodeDispatch    = FlowActions.ObjectNodeDispatch;
var ObjectNodeDispatchQ   = FlowActions.ObjectNodeDispatchQ;
var ListNodeDispatch      = FlowActions.ListNodeDispatch;
var ListNodeDispatchQ     = FlowActions.ListNodeDispatchQ;
var VariableNodeDispatch  = FlowActions.VariableNodeDispatch;
var VariableNodeDispatchQ = FlowActions.VariableNodeDispatchQ;

function xflowExecutor(flowJson, params) {

  params = params || {};

  //
  // Re-instantiable from json(schema) object
  //

  var flow  = flowJson;

  //
  // Serializable hash
  //

  var state = JSON.parse(
    JSON.stringify(params)
  );

  function getEntryNode() {
    var nodes = flow.data.nodes.filter(
      function(node) {
        return (
          node.type === 'flow' &&
          node.action === 'start'
        );
      }
    );

    if (nodes.length !== 1) {
      if (nodes.length > 1) {
        throw new Error('Multiple entry nodes found');
      }
      if (nodes.length < 1) {
        throw new Error('No entry node found');
      }
    }

    return nodes[0];
  }

  function getNode(id) {
    var nodes = flow.data.nodes.filter(
      function(node) {
        return (
          node.id === id
        );
      }
    );

    if (nodes.length !== 1) {
      if (nodes.length > 1) {
        throw new Error('Multiple nodes with ID found');
      }
      if (nodes.length < 1) {
        throw new Error('No node with ID found');
      }
    }

    return nodes[0];
  }

  function getNextNode(node) {
    console.log('getNextNode ', JSON.stringify(node));
    var edges = flow.data.edges.filter(
      function(edge) {
        return (edge[0] === node.id);
      }
    );

    if (edges.length > 1) {

      //
      // TODO : Branching condition
      //

      throw new Error('Multiple edges found');
    }

    if (edges.length === 1) {
      return getNode(edges[0][1]);
    } else {
      return null;
    }

  }

  function isTerminalNode(node) {
    return (
      (node.type === 'flow') &&
      (node.action === 'end')
    );
  }

  //
  // sync
  //

  function processNode(node) {
    var res = null;
    switch(node.type) {
    case 'object':
      res = ObjectNodeDispatch(node, state);
      break;
    case 'flow':
      res = FlowNodeDispatch(node, state);
      break;
    default:
      throw new Error("No handler for node type ", node.type);
    }
    return res;
  }

  function runToCompletion(node) {
    while (!isTerminalNode(node)) {
      console.log('runToCompletion, stepping');
      processNode(node = getNextNode(node));
    }
    return true;
  }

  function startFlow() {
    return runToCompletion(getEntryNode());
  }

  //
  // async
  //

  function processNodeQ(node) {
    var defer = RSVP.defer();

    var res = null;
    switch(node.type) {
    case 'object':
      res = ObjectNodeDispatchQ(node, state);
      break;
    case 'flow':
      res = FlowNodeDispatchQ(node, state);
      break;
    default:
      defer.reject("No handler for node type ", node.type);
    }

    defer.resolve(res);
    return defer.promise;
  }

  function runToCompletionQ(node) {
    var defer = RSVP.defer();

    try {
      while (!isTerminalNode(node)) {
        console.log('runToCompletion, stepping');
        processNode(node = getNextNode(node));
      }
    } catch(e) {
      defer.reject('runToCompletionQ : error ' + e);
    }

    defer.resolve(false);

    return defer.promise;
  }

  function startFlowQ() {
    var defer = RSVP.defer();

    runToCompletionQ(getEntryNode()).then(
      function(res) {
        console.log('startFlowQ: Resolved ', res);
        return true;
      },
      function(err) {
        console.error('startFlowQ: Rejected ', err);
        return err;
      }
    );

    return defer.promise;
  }

  return {
    start  : startFlow,
    startQ : startFlowQ
  };

}


module.exports = xflowExecutor;
