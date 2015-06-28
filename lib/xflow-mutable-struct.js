import patcher       from './ext/jsonpatcher';

const diffPatcher = patcher.create({});

import mixin          from './util/mixin';
import emittableMixin from './mixin/emittable';
import editableMixin  from './mixin/editable';

import XFlowStruct from './xflow-struct';
import FlowUtil    from './util/flow';
import LangUtil    from './util/lang';

const exists = LangUtil.exists;
const clone  = LangUtil.clone;

const isSameEdge              = FlowUtil.isSameEdge;
const isSameBranch            = FlowUtil.isSameBranch;
const isSameNode              = FlowUtil.isSameNode;
const isSameVariable          = FlowUtil.isSameVariable;
const assertIsNode            = FlowUtil.assertIsNode;
const assertIsEdge            = FlowUtil.assertIsEdge;
const assertIsBranch          = FlowUtil.assertIsBranch;
const assertIsXvar            = FlowUtil.assertIsXvar;
const assertIsValidParamScope = FlowUtil.assertIsValidParamScope;
const nextId                  = FlowUtil.nextId;

/**
 * XFlowMutableStruct class
 * Accessing and modifying XFlow structure data
 * @class XFlowMutableStruct
 * @extends XFlowStruct
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
    this.name = 'XFlowMutableStruct';

    this.initEmittable();
    this.initEditable();

    this._lastNodeId = 0;
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

  /**
   * Returns a new XFNode
   * @method newNode
   * @return {Node} XFlow JSON node
   */
  newNode() {
    return {
      id         : this.nextNodeId(),
      nodetype   : '',
      action     : '',
      label      : '',
      parameters : {}
    };
  }

  /**
   * Add a new XFNode to the flow
   * @method addNode
   * @param {Object} node XFNode
   */
  addNode(node) {
    assertIsNode(node);
    this.trackChanges(()=> {
      this.json.nodes.push(node);
    });
  }

  /**
   * Remove an XFNode from the flow
   * @method removeNode
   * @param {Object} node XFNode
   */
  removeNode(node) {
    assertIsNode(node);
    this.trackChanges(()=> {
      this.json.nodes = this.json.nodes.filter((el)=> {
        return el.id !== node.id;
      });
    });
  }

  /**
   * Remove an XFNode from the flow as well as edges and branches that reference it
   * @method removeNodeAndReferences
   * @param {Object} node XFNode
   */
  removeNodeAndReferences(node) {
    assertIsNode(node);
    this.trackChanges(()=> {
      const id = node.id;
      this.removeNode(node);
      this.json.edges = this.json.edges.filter((el)=> {
        return (
          (el[0] !== id) &&
            (el[1] !== id)
        );
      });
      this.json.branches = this.json.branches.filter((branch)=> {
        return (
          (branch.edge[0] !== id) &&
            (branch.edge[1] !== id)
        );
      });
    });
  }

  /**
   * Returns a new XFEdge
   * @method newEdge
   * @return {Array} XFlow JSON edge
   */
  newEdge() {
    return [null, null];
  }

  /**
   * Add an XFEdge
   * @method newEdge
   * @param {Array} XFlow JSON edge
   */
  addEdge(edge) {
    assertIsEdge(edge);
    this.trackChanges(()=> {
      this.json.edges.push(edge);
    });
  }

  /**
   * Remove an XFEdge
   * @method removeEdge
   * @param {Array} XFlow JSON edge
   */
  removeEdge(edge) {
    assertIsEdge(edge);
    this.trackChanges(()=> {
      this.json.edges = this.json.edges.filter((el)=> {
        return !isSameEdge(el, edge);
      });
    });
  }

  /**
   * Returns a new XFBranch
   * @method newBranch
   * @return {Object} XFBranch JSON branch
   */
  newBranch() {
    return {
      edge  : [null, null],
      name  : '',
      value : null
    };
  }

  /**
   * Add an XFBranch
   * @method addBranch
   * @param {Object} XBranch JSON branch
   */
  addBranch(branch) {
    assertIsBranch(branch);
    this.trackChanges(()=> {
      this.json.branches.push(branch);
    });
  }

  /**
   * Remove an XFBranch
   * @method removeBranch
   * @param {Object} XFBranch JSON branch
   */
  removeBranch(branch) {
    assertIsBranch(branch);
    this.trackChanges(()=> {
      this.json.branches = this.json.branches.filter((el)=> {
        return !isSameBranch(el, branch);
      });
    });
  }

  /**
   * Add a XFVariable
   * @method addVariable
   * @param {String} paramScope Valid parameter scope (in, out, local)
   * @param {Object} xvar XVar JSON
   */
  addVariable(paramScope, xvar) {
    assertIsValidParamScope(paramScope);
    assertIsXvar(xvar);
    this.trackChanges(()=> {
      this.json.variables[paramScope].push(xvar);
    });
  }

  /**
   * Remove a XFVariable
   * @method removeVariable
   * @param {String} paramScope Valid parameter scope (in, out, local)
   * @param {Object} xvar XVar JSON
   */
  removeVariable(paramScope, xvar) {
    assertIsValidParamScope(paramScope);
    this.trackChanges(()=> {
      this.json.variables[paramScope] = this.json.variables[paramScope].filter((el)=> {
        return !isSameVariable(el, xvar);
      });
    });
  }

}

mixin(XFlowMutableStruct, emittableMixin);
mixin(XFlowMutableStruct, editableMixin);

export default XFlowMutableStruct;
