import XFlowValidator from './xflow-validator';

const validator      = new XFlowValidator();

import FlowUtil from './util/flow';
import LangUtil from './util/lang';

const exists         = LangUtil.exists;
const mergeDict      = LangUtil.mergeDict;
const isSameEdge     = FlowUtil.isSameEdge;
const isTerminalNode = FlowUtil.isTerminalNode;
const isEntryNode    = FlowUtil.isEntryNode;
const isBranchNode   = FlowUtil.isBranchNode;
const getEntryNode   = FlowUtil.getEntryNode;
const getNode        = FlowUtil.getNode;

class XFlowStruct {

  constructor(json) {
    if (!validator.validate(json)) {
      throw new Error('XFlowStruct : Invalid flow JSON');
    }
    this.json = json;
  }

  getInEdges(node) {
    return this.json.edges.filter(
      (edge) =>
        edge[1] === node.id
    );
  }

  getOutEdges(node) {
    return this.json.edges.filter(
      (edge) =>
        edge[0] === node.id
    );
  }

  getBranchesFor(edge) {
    return this.json.branches.filter(
      (branch) =>
        isSameEdge(edge, branch.branch)
    );
  }

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

  getEntryNode() {
    return getEntryNode(this.json.nodes);
  }

  isEntryNode(node) {
    return isEntryNode(node);
  }

  isTerminalNode(node) {
    return isTerminalNode(node);
  }

  isBranchNode(node) {
    return isBranchNode(node);
  }

  //
  // Straight-up JSON wrappers
  //

  getNodes() {
    return this.json.nodes;
  }

  getEdges() {
    return this.json.edges;
  }

  getBranches() {
    return this.json.branches;
  }

  getSignature() {
    return this.json.signature;
  }

  getVariables() {
    return this.json.variables;
  }

  getVersion() {
    return this.json.version;
  }

  getName() {
    return this.json.version;
  }

  getId() {
    return this.json.id;
  }

  getRequirements() {
    return this.json.requirements;
  }

}

export default XFlowStruct;
