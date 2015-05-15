import EventEmitter2 from 'eventemitter2';
import jsondiffpatch from 'jsondiffpatch';

const diffPatcher = jsondiffpatch.create({});

import XFlowStruct from './xflow-struct';
import FlowUtil    from './util/flow';
import LangUtil    from './util/lang';

const {
  exists
} = LangUtil;

const {
  isSameEdge,
  isSameBranch,
  isSameNode,
  assertIsNode,
  assertIsEdge,
  assertIsBranch,
  nextId
} = FlowUtil;

function clone(json) {
  return JSON.parse(JSON.stringify(json));
}

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

  makeChange(old) {
    const delta = diffPatcher.diff(old, this.json);
    if (exists(delta)) {
      // console.log('delta is ', JSON.stringify(delta));
      /**
       * Fired when state changes, delta supplied in JSON-PATCH format
       * @event stateChange
       * @param {String} id
       * @param {Object} delta
       */
      this.emit('stateChange', delta);
    }
  }

  wrapChange(fn) {
    const old = clone(this.json);
    fn();
    this.makeChange(old);
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
    this.wrapChange(()=> {
      this.json.nodes.push(node);
    });
  }

  removeNode(node) {
    assertIsNode(node);
    this.wrapChange(()=> {
      this.json.nodes = this.json.nodes.filter((el)=> {
        return el.id !== node.id;
      });
    });
  }

  removeNodeAndReferences(node) {
    assertIsNode(node);
    this.wrapChange(()=> {
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

  newEdge() {
    return [null, null];
  }

  addEdge(edge) {
    assertIsEdge(edge);
    this.wrapChange(()=> {
      this.json.edges.push(edge);
    });
  }

  removeEdge(edge) {
    assertIsEdge(edge);
    this.wrapChange(()=> {
      this.json.edges = this.json.edges.filter((el)=> {
        return !isSameEdge(el, edge);
      });
    });
  }

  newBranch() {
    return {
      edge  : [null, null],
      name  : '',
      value : null
    };
  }

  addBranch(branch) {
    assertIsBranch(branch);
    this.wrapChange(()=> {
      this.json.branches.push(branch);
    });
  }

  removeBranch(branch) {
    assertIsBranch(branch);
    this.wrapChange(()=> {
      this.json.branches = this.json.branches.filter((el)=> {
        return !isSameBranch(el, branch);
      });
    });
  }

}

export default XFlowMutableStruct;
