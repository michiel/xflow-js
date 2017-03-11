import {
  exists,
  isObject,
  isString,
  isNumber,
  isArray,
} from './lang';

/**
 * XFlow helper functions
 * @class FlowUtil
 * @static
 */

/**
 * @method isSameNode
 * @param {Object} a First node
 * @param {Object} b Second node
 * @return {Boolean} Returns `true` is `a` and `b` have the same node ID
 */
export function isSameNode(a, b) {
  return (
    (a.id === b.id)
  );
}

/**
 * @method isSameBranch
 * @param {Object} a First branch
 * @param {Object} b Second branch
 * @return {Boolean} Returns `true` if `a` and `b` are the same branch
 */
export function isSameBranch(a, b) {
  return (
    isSameEdge(a.edge, b.edge) &&
      (a.name === b.name) &&
      (a.value === b.value)
  );
}

/**
 * @method isSameEdge
 * @param {Array} a First edge
 * @param {Array} b Second edge
 * @return {Boolean}
 */
export function isSameEdge(a, b) {
  return (
    (a[0] === b[0]) &&
      (a[1] === b[1])
  );
}

/**
 * @method isSameVariable
 * @param {Object} a First variable (xvar)
 * @param {Object} b Second variable (xvar)
 * @return {Boolean}
 */
export function isSameVariable(a, b) {
  return (
    (a.name === b.name) &&
    (a.vtype === b.vtype) &&
    (
      exists(a.value) &&
        (exists(b.value)) ?
        (a.value === b.value) : true
    )
  );
}

/**
 * @method isBranchNode
 * @param {Object} XFNode
 * @return {Boolean}
 */
export function isBranchNode(node) {
  return (
    (node.nodetype === 'flow') &&
    (node.action === 'branch')
  );
}

/**
 * @method isTerminalNode
 * @param {Object} XFNode
 * @return {Boolean}
 */
export function isTerminalNode(node) {
  return (
    (node.nodetype === 'flow') &&
    (node.action === 'end')
  );
}

/**
 * @method isEntryNode
 * @param {Object} XFNode
 * @return {Boolean}
 */
export function isEntryNode(node) {
  return (
    (node.nodetype === 'flow') &&
    (node.action === 'start')
  );
}

/**
 * @method getNodeType
 * @param {Array} nodes XFNodes
 * @param {String} type Node type (optional)
 * @param {String} type Node action type (optional)
 * @return {Array}
 */
export function getNodeType(nodes, type, action) {
  return nodes.filter(
    (node) =>
      (!exists(type) ? true : (node.nodetype === type)) &&
      (!exists(action) ? true : (node.action === action))
  );
}

/**
 * @method getEntryNode
 * @param {Array} nodes XFNodes
 * @return {Object} XFNode
 * @throws {Error} When multiple entry nodes found
 * @throws {Error} When no entry nodes found
 */
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

/**
 * @method getNode
 * @param {String} id Node ID
 * @param {Array} nodes XFNodes
 * @return {Object} XFNode
 * @throws {Error} When multiple nodes with ID found
 * @throws {Error} When no nodes with ID found
 */
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

/**
 * @method assertIsNode
 * @param {Object} node XFNode
 * @return {null}
 * @throws {Error} When node is not a XFNode
 */
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

/**
 * @method assertIsEdge
 * @param {Array} edge XFNode
 * @return {null}
 * @throws {Error} When edge is not a XFEdge
 */
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

/**
 * @method assertIsBranch
 * @param {Object} branch XFBranch
 * @return {null}
 * @throws {Error} When branch is not a XFBranch
 */
export function assertIsBranch(branch) {
  if (!(
    exists(branch) &&
    isArray(branch.edge) &&
    exists(branch.name) &&
    exists(branch.value)
  )) {
    throw new Error(
      `assertIsEdge : argument '${branch}'is not a valid branch`
    );
  }
}

/**
 * @method assertIsValidParamScope
 * @param {String} p The scope name (input, output, local)
 * @return {null}
 * @throws {Error} When p is not a valid scope name
 */
export function assertIsValidParamScope(p) {
  if (['input', 'local', 'output'].indexOf(p) < 0) {
    throw new Error(
      `assertIsValidParamScope : ${p} is not a valid parameter scope (input, output, local)`
    );
  }
}

/**
 * @method assertIsXvar
 * @param {Object} xvar
 * @return {null}
 * @throws {Error} When xvar is not a valid XVar
 */
export function assertIsXvar(xvar) {
  if (!(
    exists(xvar) &&
    exists(xvar.name) &&
    exists(xvar.vtype)
  )) {
    throw new Error(
      `assertIsXvar : invalid xvar ${xvar}`
    );
  }
}

/**
 * @method nextId
 * @param {Array} range Objects with unique integer IDs
 * @param {String} key (optional) Default 'id'
 * @return {Number}
 */
export function nextId(range, key = 'id') {
  return range.reduce((prev, el)=> {
    return (el[key] > prev) ? el[key] : prev;
  }, 0) + 1;
}

export default {
  isSameEdge,
  isSameBranch,
  isBranchNode,
  isSameNode,
  isSameVariable,
  isEntryNode,
  isTerminalNode,
  getEntryNode,
  getNodeType,
  getNode,
  nextId,
  assertIsNode,
  assertIsEdge,
  assertIsBranch,
  assertIsXvar,
  assertIsValidParamScope,
};

