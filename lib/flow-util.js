
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


export default {
  exists         : exists,
  hasProperty    : hasProperty,
  mergeDict      : mergeDict,
  isSameEdge     : isSameEdge,
  isTerminalNode : isTerminalNode,
  getEntryNode   : getEntryNode,
  getNode        : getNode
};
