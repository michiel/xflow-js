import EventEmitter2 from 'eventemitter2';
import jsondiffpatch from 'jsondiffpatch';

const diffPatcher = jsondiffpatch.create({});

import XFlowStruct from './xflow-struct';
import FlowUtil    from './util/flow';

const {
  isSameEdge,
  isSameBranch,
  isSameNode,
  assertIsNode,
  assertIsEdge,
  assertIsBranch,
  nextId
} = FlowUtil;

/**
 * XFlowMutableStruct class
 * Accessing and modifying XFlow structure data
 * @class XFlowMutableStruct
 */
class XFlowMutableStruct extends XFlowStruct {

  /**
   * XFlowMutableStruct constructor
   * @class XFlowMutableStruct
   * @constructor XFlowMutableStruct
   * @param {Object} json XFlow JSON
   */
  constructor(json) {
    super(json);

    /**
     * Event emitter
     * @property emitter
     */
    const EmitC  = EventEmitter2.EventEmitter2 || EventEmitter2;
    this.emitter = new EmitC({
      wildcard : true
    });

    this._lastNodeId = 0;
  }

  emit(name, ...args) {
    this.emitter.emit.apply(
      this.emitter,
      [name, this.id].concat(...args)
    );
  }

  //
  // the new* methods return objects that don't pass validation, by design
  //

  nextNodeId() {
    let n = 0;
    if (this._lastNodeId === 0) {
      n = nextId(this.json.nodes);
    } else {
      n = this._lastNodeId + 1;
    }
    this._lastNodeId = n;
    return n;
  }

  newNode() {
    return {
      id         : this.nextNodeId(),
      nodetype   : '',
      action     : '',
      label      : '',
      parameters : {}
    };
  }

  addNode(node) {
    assertIsNode(node);
    this.json.nodes.push(node);
  }

  removeNode(node) {
    assertIsNode(node);
    this.json.nodes = this.json.nodes.filter((el)=> {
      return el.id !== node.id;
    });
  }

  newEdge() {
    return [null, null];
  }

  addEdge(edge) {
    assertIsEdge(edge);
    this.json.edgees.push(edge);
  }

  removeEdge(edge) {
    assertIsEdge(edge);
    this.json.edges = this.json.edges.filter((el)=> {
      return !isSameEdge(el, edge);
    });
  }

  newBranch() {
    const branch = {
      branch : [],
      name   : '',
      value  : ''
    };
    return branch;
  }

  addBranch(branch) {
    assertIsBranch(branch);
    this.json.branches.push(branch);
  }

  removeBranch(branch) {
    assertIsBranch(branch);
    this.json.branches = this.json.branches.filter((el)=> {
      return !isSameBranch(el, branch);
    });
  }

}

export default XFlowMutableStruct;
