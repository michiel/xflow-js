/* global load */

function load(json) {

}

//
// Objects
//

function fetchObjectQ(id, type) {

}

function fetchQueryQ(type, query, params) {

}

function createObjectQ(type) {

}

function saveObjectQ(obj) {

}

function setAttributesQ(obj, attrs) {

}

function ObjectNodeDispatch(node) {
  var defer = $q.defer();

  switch(node.action) {
  case 'save':
    saveObject(/* XXX */);
    break;
  case 'create':
    createObject(/* XXX */);
    break;
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

var createObjectJSON = {
  id   : 'asd',
  name : 'asd',
  data : {
    capabilities : [
    {
      type    : 'flow',
      version : 1
    },
    {
      type    : 'object',
      version : 1
    }
    ],
    nodes : [
      {
        id         : 1,
        type       : 'flow',
        action     : 'start',
        parameters : {}
      },
      {
        id         : 2,
        type       : 'object',
        action     : 'create',
        parameters : {
          object : 'User'
        }
      },
      {
        id         : 3,
        type       : 'object',
        action     : 'setattributes',
        parameters : {
          object     : 'User',
          attributes : {
            name : 'Joe Blow'
          }
        }
      },
      {
        id         : 3,
        type       : 'object',
        action     : 'save',
        parameters : {
          object     : 'User'
        }
      },
      {
        id         : 5,
        type       : 'flow',
        action     : 'end',
        parameters : {}
      }
    ],
    edges : [
      [1,2],
      [2,3],
      [3,4],
      [4,5]
    ]
  }
};
