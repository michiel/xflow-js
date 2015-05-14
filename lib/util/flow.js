import LangUtil from './lang';

const exists   = LangUtil.exists;
const isObject = LangUtil.isObject;
const isString = LangUtil.isString;
const isNumber = LangUtil.isNumber;
const isArray  = LangUtil.isArray;

export function isSameNode(a, b) {
  return (
    (a.id === b.id)
  );
}

export function isSameBranch(a, b) {
  return (
    isSameEdge(a.branch, b.branch) &&
      (a.name === b.name) &&
      (a.value === b.value)
  );
}

export function isSameEdge(a, b) {
  return (
    (a[0] === b[0]) &&
      (a[1] === b[1])
  );
}

export function isBranchNode(node) {
  return (
    (node.nodetype === 'flow') &&
    (node.action === 'branch')
  );
}

export function isTerminalNode(node) {
  return (
    (node.nodetype === 'flow') &&
    (node.action === 'end')
  );
}

export function isEntryNode(node) {
  return (
    (node.nodetype === 'flow') &&
    (node.action === 'start')
  );
}

export function getNodeType(nodes, type, action) {
  return nodes.filter(
    (node) =>
      (!exists(type) ? true : (node.nodetype === type)) &&
      (!exists(action) ? true : (node.action === action))
  );
}

export function getEntryNode(nodes) {
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

export function getNode(id, nodes) {
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

export function assertIsNode(node) {
  if (!(
    isObject(node) &&
    isString(node.nodetype) &&
    isString(node.action)
  )) {
    throw new Error(
      `assertIsNode : argument '${node}' is not a valid node`
    );
  }
}

export function assertIsEdge(edge) {
  if (!(
    isArray(edge) &&
    edge.length === 2 &&
    isNumber(edge[0]) &&
    isNumber(edge[1])
  )) {
    throw new Error(
      `assertIsEdge : argument '${edge}'is not a valid edge`
    );
  }
}

export function assertIsBranch(branch) {
  if (!(
    exists(branch) &&
    isArray(branch.branch) &&
    exists(branch.name) &&
    exists(branch.value)
  )) {
    throw new Error(
      `assertIsEdge : argument '${branch}'is not a valid branch`
    );
  }
}

export function nextId(range, key='id') {
  return range.reduce((prev, el)=> {
    return (el[key] > prev) ? el[key] : prev;
  }, 0) + 1;
}

export default {
  isSameEdge     : isSameEdge,
  isBranchNode   : isBranchNode,
  isEntryNode    : isEntryNode,
  isTerminalNode : isTerminalNode,
  getEntryNode   : getEntryNode,
  getNodeType    : getNodeType,
  getNode        : getNode,
  assertIsNode   : assertIsNode,
  assertIsEdge   : assertIsEdge,
  assertIsBranch : assertIsBranch,
  nextId         : nextId
};

