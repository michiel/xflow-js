import LangUtil from './lang';

const exists = LangUtil.exists;

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

function getNodeType(nodes, type, action) {
  return nodes.filter(
    (node) =>
      (!exists(type) ? true : (node.type === type)) &&
      (!exists(action) ? true : (node.action === action))
  );
}

function getEntryNode(nodes) {
  const resNodes = getNodeType(nodes, 'flow', 'start');

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
  const resNodes = nodes.filter(
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
  isSameEdge     : isSameEdge,
  isTerminalNode : isTerminalNode,
  getEntryNode   : getEntryNode,
  getNodeType    : getNodeType,
  getNode        : getNode
};
