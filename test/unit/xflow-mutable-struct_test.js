import chai           from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs             from 'fs';

chai.use(chaiAsPromised);

import XFlowMutableStruct  from '../../lib/xflow-mutable-struct';

function getXFlowJSON(path) {
  var data = fs.readFileSync(path, 'utf-8');
//   try {
//     JSON.parse(data);
//   } catch(e) {
//     console.log('The offending file is : ', path);
//   }
  return JSON.parse(data);
}

function clone(json) {
  return JSON.parse(JSON.stringify(json));
}

describe('XFlowMutableStruct ', function() {

  /* jshint maxstatements:150 */

  it('can add nodes ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowMutableStruct(json);

    var node = xf.newNode();
    xf.addNode(node);

    expect(xf.getNodes().length).to.equal(11);
  });

  it('can remove nodes ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowMutableStruct(json);

    var node = xf.newNode();
    xf.addNode(node);

    expect(xf.getNodes().length).to.equal(11);

    xf.removeNode(node);
    expect(xf.getNodes().length).to.equal(10);

  });

  it('can add edges ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowMutableStruct(json);

    var edge = xf.newEdge();
    var nodes = xf.getNodes();
    edge[0] = nodes[1].id;
    edge[1] = nodes[0].id;
    xf.addEdge(edge);

    expect(xf.getEdges().length).to.equal(10);

  });

  it('can remove edges ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowMutableStruct(json);

    var edge = xf.newEdge();
    var nodes = xf.getNodes();
    edge[0] = nodes[1].id;
    edge[1] = nodes[0].id;
    xf.addEdge(edge);

    expect(xf.getEdges().length).to.equal(10);

    xf.removeEdge(edge);

    expect(xf.getEdges().length).to.equal(9);
  });

  it('can add branches ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowMutableStruct(json);

    var branch = xf.newBranch();
    var nodes = xf.getNodes();
    branch.edge[0] = nodes[1].id;
    branch.edge[1] = nodes[0].id;
    branch.name  = 'SomeBranchValue';
    branch.value = 1;
    xf.addBranch(branch);

    expect(xf.getBranches().length).to.equal(1);

  });

  it('can remove branches ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowMutableStruct(json);

    var branch = xf.newBranch();
    var nodes = xf.getNodes();
    branch.edge[0] = nodes[1].id;
    branch.edge[1] = nodes[0].id;
    branch.name  = 'SomeBranchValue';
    branch.value = 1;
    xf.addBranch(branch);

    expect(xf.getBranches().length).to.equal(1);

    xf.removeBranch(branch);

    expect(xf.getBranches().length).to.equal(0);
  });

  it('can remove a node and all its references', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowMutableStruct(json);

    var nodes = xf.getNodes();
    var id    = nodes[0].id;

    var initialEdgesLength    = xf.getEdges().length;
    var initialBranchesLength = xf.getBranches().length;

    xf.removeNodeAndReferences(nodes[0]);

    expect(xf.getEdges().length).to.equal(initialEdgesLength - 1);
    expect(xf.getBranches().length).to.equal(initialBranchesLength);

    var branches = xf.getBranches().filter(function(branch) {
      return (
        (branch.edge[0] === id) ||
          (branch.edge[1] === id)
      );
    });

    expect(branches.length).to.equal(0);

    var edges = xf.getEdges().filter(function(edge) {
      return (
        (edge[0] === id) ||
          (edge[1] === id)
      );
    });

    expect(edges.length).to.equal(0);

  });

  it('can add variables (input) ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowMutableStruct(json);

    expect(xf.getVariables().input.length).to.equal(1);

    xf.addVariable('input', {
      name  : 'SomeNewVar',
      vtype : 'number'
    });

    expect(xf.getVariables().input.length).to.equal(2);
  });

  it('can remove variables (input) ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowMutableStruct(json);

    expect(xf.getVariables().input.length).to.equal(1);

    xf.addVariable('input', {
      name  : 'SomeNewVar',
      vtype : 'number'
    });

    expect(xf.getVariables().input.length).to.equal(2);

    xf.removeVariable('input', {
      name  : 'SomeNewVar',
      vtype : 'number'
    });

    expect(xf.getVariables().input.length).to.equal(1);
  });

  it('can add variables (output) ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowMutableStruct(json);
    xf.addVariable('output', {
      name  : 'SomeNewVar',
      vtype : 'number'
    });
  });

  it('can remove variables (output) ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowMutableStruct(json);

    expect(xf.getVariables().output.length).to.equal(1);

    xf.addVariable('output', {
      name  : 'SomeNewVar',
      vtype : 'number'
    });

    expect(xf.getVariables().output.length).to.equal(2);

    xf.removeVariable('output', {
      name  : 'SomeNewVar',
      vtype : 'number'
    });

    expect(xf.getVariables().output.length).to.equal(1);
  });

  it('can add variables (local) ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowMutableStruct(json);
    xf.addVariable('local', {
      name  : 'SomeNewVar',
      vtype : 'number'
    });
  });

  it('can remove variables (local) ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowMutableStruct(json);

    expect(xf.getVariables().local.length).to.equal(0);

    xf.addVariable('local', {
      name  : 'SomeNewVar',
      vtype : 'number'
    });

    expect(xf.getVariables().local.length).to.equal(1);

    xf.removeVariable('local', {
      name  : 'SomeNewVar',
      vtype : 'number'
    });

    expect(xf.getVariables().local.length).to.equal(0);
  });


  it('throws errors when called incorrectly ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowMutableStruct(json);

    expect(function() {
      xf.addVariable('foo', {});
    }).to.throw(Error);

    expect(function() {
      xf.addVariable('in', {});
    }).to.throw(Error);

    expect(function() {
      xf.addVariable('in', {
        name: 'Foo'
      });
    }).to.throw(Error);

  });

  it('can undo', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowMutableStruct(json);

    var originalJson = clone(json);

    xf.addVariable('local', {
      name  : 'SomeNewVar',
      vtype : 'number'
    });

    xf.addVariable('local', {
      name  : 'SomeNewVar2',
      vtype : 'number'
    });

    xf.addVariable('local', {
      name  : 'SomeNewVar3',
      vtype : 'number'
    });

    expect(xf.getVariables().local.length).to.equal(3);
    expect(xf.json).to.not.deep.equal(originalJson);

    expect(xf.undo()).to.equal(true);
    expect(xf.undo()).to.equal(true);
    expect(xf.undo()).to.equal(true);
    expect(xf.undo()).to.equal(false);

    expect(xf.json).to.deep.equal(originalJson);
  });

  it('can undo a variety of changes', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowMutableStruct(json);

    var originalJson = clone(json);

    var node = xf.newNode();
    xf.addNode(node);

    expect(xf.getNodes().length).to.equal(11);
    xf.undo();
    expect(xf.getNodes().length).to.equal(10);

    var node2 = xf.newNode();
    xf.addNode(node2);

    expect(xf.getNodes().length).to.equal(11);
    xf.undo();
    expect(xf.getNodes().length).to.equal(10);

    xf.addVariable('local', {
      name  : 'SomeNewVar3',
      vtype : 'number'
    });

    xf.addVariable('local', {
      name  : 'SomeNewVar',
      vtype : 'number'
    });

    expect(xf.getVariables().local.length).to.equal(2);
    expect(xf.json).to.not.deep.equal(originalJson);

    expect(xf.undo()).to.equal(true);
    expect(xf.undo()).to.equal(true);
    expect(xf.undo()).to.equal(false);

    expect(xf.json).to.deep.equal(originalJson);
  });

  it('can undo multiple changes', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowMutableStruct(json);

    var originalJson = clone(json);

    var node1 = xf.getNode(1);
    var node2 = xf.getNode(2);

    xf.removeNode(node1);
    xf.removeNode(node2);

    expect(xf.undo()).to.equal(true);
    expect(xf.undo()).to.equal(true);
    expect(xf.undo()).to.equal(false);

    expect(xf.json).to.deep.equal(originalJson);
  });

});





