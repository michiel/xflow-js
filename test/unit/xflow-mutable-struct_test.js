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

describe('XFlowMutableStruct ', function() {

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
    branch.branch[0] = nodes[1].id;
    branch.branch[1] = nodes[0].id;
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
    branch.branch[0] = nodes[1].id;
    branch.branch[1] = nodes[0].id;
    branch.name  = 'SomeBranchValue';
    branch.value = 1;
    xf.addBranch(branch);

    expect(xf.getBranches().length).to.equal(1);

    xf.removeBranch(branch);

    expect(xf.getBranches().length).to.equal(0);
  });


});


