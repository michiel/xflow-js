import XFlowValidator from './xflow-validator';

const validator      = new XFlowValidator();

import FlowUtil from './util/flow';
import LangUtil from './util/lang';

const {
  exists,
  mergeDict
} = LangUtil;

const {
  isSameEdge,
  isTerminalNode,
  isEntryNode,
  isBranchNode,
  getEntryNode,
  getNode
} = FlowUtil;

/**
 * XFlowStruct class
 * Accessing XFlow structure data
 * @class XFlowStruct
 */
class XFlowStruct {

  /**
   * XFlowStruct constructor
   * @class XFlowStruct
   * @constructor XFlowStruct
   * @param {Object} json XFlow JSON
   */
  constructor(json) {
    if (!validator.validate(json)) {
      throw new Error('XFlowStruct : Invalid flow JSON');
    }
    this.json = json;
  }

  /**
   * Gets all in edges for a node (inbound edges)
   * @method getInEdges
   * @return {Node} XFlow JSON node
   */
  getInEdges(node) {
    return this.json.edges.filter(
      (edge) =>
        edge[1] === node.id
    );
  }

  /**
   * Gets all out edges for a node (outbound edges)
   * @method getOutEdges
   * @return {Node} XFlow JSON node
   */
  getOutEdges(node) {
    return this.json.edges.filter(
      (edge) =>
        edge[0] === node.id
    );
  }

  /**
   * Gets all out branches (edges + conditions) for an edge ([out, in])
   * @method getBranchesFor
   * @return {Edge} XFlow edge
   */
  getBranchesFor(edge) {
    return this.json.branches.filter(
      (branch) =>
        isSameEdge(edge, branch.edge)
    );
  }

  /**
   * Get the next node for a non-branch, non-terminal node
   * @method getNextNode
   * @return {Node} XFlow node
   */
  getNextNode(node) {
    if (this.isBranchNode(node)) {
      throw new Error(
        `XFlowStruct.getNext : this node ${node.id} has multiple branches, cannot infer next node`
      );
    }

    if (this.isTerminalNode(node)) {
      throw new Error(
        `XFlowStruct.getNext : this node ${node.id} is a terminal node, there is no next node`
      );
    }

    return getNode(
      this.getOutEdges(node)[0][1], /* [first edge][next node id] */
      this.json.nodes
    );
  }

  /**
   * Get the first node of the flow
   * @method getEntryNode
   * @return {Node} XFlow node
   */
  getEntryNode() {
    return getEntryNode(this.json.nodes);
  }

  /**
   * Test if a node is the entry node (first node of the flow)
   * @method isEntryNode
   * @param {Node} node XFlow node
   * @return {Boolean}
   */
  isEntryNode(node) {
    return isEntryNode(node);
  }

  /**
   * Test if a node is a terminal node
   * @method isTerminalNode
   * @param {Node} node XFlow node
   * @return {Boolean}
   */
  isTerminalNode(node) {
    return isTerminalNode(node);
  }

  /**
   * Test if a node is a branch node
   * @method isBranchNode
   * @param {Node} XFlow node
   * @return {Boolean}
   */
  isBranchNode(node) {
    return isBranchNode(node);
  }

  //
  // Straight-up JSON wrappers
  //

  /**
   * Get an Array of all the flow nodes
   * @method getNodes
   * @return {Array} Array of Nodes
   */
  getNodes() {
    return this.json.nodes;
  }

  /**
   * Get an Array of all the flow edges
   * @method getEdges
   * @return {Array} Array of Edges
   */
  getEdges() {
    return this.json.edges;
  }

  /**
   * Get an Array of all the flow branches
   * @method getBranches
   * @return {Array} Array of Branches
   */
  getBranches() {
    return this.json.branches;
  }

  /**
   * Get an Array of the flow variables (scope)
   * @method getVariables
   * @return {Array} Array of XFlow VarType objects
   */
  getVariables() {
    return this.json.variables;
  }

  /**
   * Get the flow version
   * @method getVersion
   * @return {String}
   */
  getVersion() {
    return this.json.version;
  }

  /**
   * Get the flow name
   * @method getName
   * @return {String}
   */
  getName() {
    return this.json.version;
  }

  /**
   * Get the flow ID
   * @method getId
   * @return {String}
   */
  getId() {
    return this.json.id;
  }

  /**
   * Get the flow capability requirements with their versions (e.g. flow,
   * object, flox)
   * @method getRequirements
   * @return {Array} Array of Requirement objects
   */
  getRequirements() {
    return this.json.requirements;
  }
}

export default XFlowStruct;
