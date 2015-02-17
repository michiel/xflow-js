var tv4 = require('tv4');
var Q   = require('q');


/* global load */



function load(json) {

}

//
// List operations
//

var LNDProxy = {
  fetchQueryQ: function(node, state) {
    var defer = Q.defer();
    defer.resolve(true);
    return defer.promise;
  }
};

//
// Object operations
//


var ONDProxy = {
  fetchObjectQ : function(node, state) {
    var defer = Q.defer();
    defer.resolve(true);
    return defer.promise;
  },
  fetchQueryQ : function(node, state) {
    var defer = Q.defer();
    defer.resolve(true);
    return defer.promise;
  },
  createObjectQ : function(node, state) {
    var defer = Q.defer();
    defer.resolve(true);
    return defer.promise;
  },
  saveObjectQ : function(node, state) {
    var defer = Q.defer();
    defer.resolve(true);
    return defer.promise;
  },
  setAttributesQ : function(node, state) {
    var defer = Q.defer();
    defer.resolve(true);
    return defer.promise;
  }
};

var FNDProxy = {
  startQ : function() {
    console.log('start flow');
    var defer = Q.defer();
    defer.resolve(true);
    return defer.promise;
  },
  endQ : function() {
    console.log('end flow');
    var defer = Q.defer();
    defer.resolve(true);
    return defer.promise;
  }
};

function ObjectNodeDispatch(node, state) {
  var defer = $q.defer();

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

  ONDProxy[method].apply(null, arguments).then(
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
  var defer = $q.defer();

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

function runner(json) {

  //
  // Re-instantiable from json(schema) object
  //

  var flow  = load(json);

  //
  // Serializable hash
  //

  var state = {
  };

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
    var edges = flow.data.edges.filter(
      function(edge) {
        return (edge[0] === node.id);
      }
    );

    if (edges.length > 1) {
      if (edges.length > 1) {
        throw new Error('Multiple edges found');
      }
    }

    if (edges.length === 1) {
      return getNode(edges[0][1]);
    } else {
      return null;
    }

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

  function startFlow() {
    runToCompletion(getEntryNode());
  }

  function runToCompletion(node) {
    while (node !== null) {
      // state.activenode = node.id;
      processNode(node);

      node = getNextNode();
    }
  }

}

