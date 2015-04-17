import XFlowValidator from './xflow-validator';

const validator      = new XFlowValidator();

import FlowUtil from './util/flow';
import LangUtil from './util/lang';

const exists         = LangUtil.exists;
const mergeDict      = LangUtil.mergeDict;
const isSameEdge     = FlowUtil.isSameEdge;
const isTerminalNode = FlowUtil.isTerminalNode;
const isEntryNode    = FlowUtil.isEntryNode;
const getEntryNode   = FlowUtil.getEntryNode;
const getNode        = FlowUtil.getNode;

class XFlowStruct {

  constructor(json) {
    if (!validator.validate(json)) {
      throw new Error('XFlowStruct : Invalid flow JSON');
    }
    this.json = json;
  }

  isBranch(node) {
    return (this.getEdges(node).length > 1);
  }

  getEdges(node) {
    return this.json.edges.filter(
      (edge) =>
        edge[0] === node.id
    );
  }

  getBranches(edge) {
    return this.json.branches.filter(
      (branch) =>
        isSameEdge(edge, branch)
    );
  }

  getNextNode(node) {
    if (this.isBranch(node)) {
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
      this.getEdges(node)[0][1], /* [first edge][next node id] */
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


}

export default XFlowStruct;
