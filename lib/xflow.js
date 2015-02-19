var tv4  = require('tv4');
var RSVP = require('rsvp');

//
// List operations
//

var ListNDProxy = {
  fetchQueryQ: function(node, state) {
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  },
  updateQueryQ: function(node, state) {
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  },
  deleteQueryQ : function(node, state) {
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  }
};

//
// Object operations
//

var ObjectNDProxy = {
  fetchObjectQ : function(node, state) {
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  },
  fetchQueryQ : function(node, state) {
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  },
  createObjectQ : function(node, state) {
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  },
  saveObjectQ : function(node, state) {
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  },
  setAttributesQ : function(node, state) {
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  }
};

var VariableNDProxy = {
  set : function(node, state) {
    console.log('set variable');
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  }
};

var FlowNDProxy = {
  startQ : function() {
    console.log('start flow');
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  },
  endQ : function() {
    console.log('end flow');
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  }
};

function ObjectNodeDispatch(node, state) {
  var defer = RSVP.defer();

  var method = '';

  switch(node.action) {
  case 'retrieve':
    method = 'fetchObjectQ';
    break;
  case 'save':
    method = 'saveObjectQ';
    break;
  case 'create':
    method = 'createObjectQ';
    break;

  default:
    defer.reject('No object/action dispatch for ', node.action);
  }

  ObjectNDProxy[method].apply(null, arguments).then(
    function(res) {
      return res;
    },
    function(err) {
      defer.reject(err);
    }
  );

  return defer.promise;
}

//
// Flows
//

function FlowNodeDispatcher(node) {
  var defer = RSVP.defer();

  switch(node.action) {
  case 'start':
    break;
  case 'end':
    break;
  default:
    defer.reject('No flow/action dispatch for ', node.action);
  }

  return defer.promise;
}

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

  function processNode(node) {
    switch(node.type) {
    case 'object':
      break;
    case 'flow':
      break;
    default:
      throw new Error("No handler for node type ", node.type);
    }
  }

  //
  // sync
  //

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

    defer.resolve(true);

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
