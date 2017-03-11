import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';

chai.use(chaiAsPromised);

import XFlowStruct from '../../src/xflow-struct';

function getXFlowJSON(path) {
  const data = fs.readFileSync(path, 'utf-8');
//   try {
//     JSON.parse(data);
//   } catch(e) {
//     console.log('The offending file is : ', path);
//   }
  return JSON.parse(data);
}

describe('XFlowstruct ', function() {

  it('can get all variables ', function() {
    const json = getXFlowJSON('data/flows/10_steps.json');
    const xf = new XFlowStruct(json);

    const xvars = xf.getVariables();

    expect(xvars.input.length).to.equal(1);
    expect(xvars.output.length).to.equal(1);
    expect(xvars.local.length).to.equal(0);
  });

  it('can get input variables ', function() {
    const json = getXFlowJSON('data/flows/10_steps.json');
    const xf = new XFlowStruct(json);

    const xvars = xf.getInVariables();
    expect(xvars.length).to.equal(1);
  });

  it('can get output variables ', function() {
    const json = getXFlowJSON('data/flows/10_steps.json');
    const xf = new XFlowStruct(json);

    const xvars = xf.getOutVariables();
    expect(xvars.length).to.equal(1);
  });

  it('can get local variables ', function() {
    const json = getXFlowJSON('data/flows/10_steps.json');
    const xf = new XFlowStruct(json);

    const xvars = xf.getLocalVariables();
    expect(xvars.length).to.equal(0);
  });

  it('can get the version ', function() {
    const json = getXFlowJSON('data/flows/10_steps.json');
    const xf = new XFlowStruct(json);

    expect(xf.getVersion()).to.equal(1);
  });

  it('can get the name ', function() {
    const json = getXFlowJSON('data/flows/10_steps.json');
    const xf = new XFlowStruct(json);

    expect(xf.getName()).to.equal('steps');
  });

  it('can get the ID ', function() {
    const json = getXFlowJSON('data/flows/10_steps.json');
    const xf = new XFlowStruct(json);

    expect(xf.getId()).to.equal('steps');
  });

  it('can get the requirements ', function() {
    const json = getXFlowJSON('data/flows/10_steps.json');
    const xf = new XFlowStruct(json);

    expect(xf.getRequirements()).to.deep.equal([
      {
        'xtype': 'flow',
        'version': 1,
      },
      {
        'xtype': 'flox',
        'version': 1,
      },
    ]);
  });

  it('can get JSON string of the flow ', function() {
    const json = getXFlowJSON('data/flows/10_steps.json');
    const xf = new XFlowStruct(json);

    expect(function() {
      xf.toString();
    }).to.not.throw(Error);
  });

  it('can check if a node is an entry node', function() {
    const json = getXFlowJSON('data/flows/10_steps.json');
    const xf = new XFlowStruct(json);
    const nodes = xf.getNodes();

    expect(
      xf.isEntryNode(nodes[0])
    ).to.equal(true);

    expect(
      xf.isEntryNode(nodes[1])
    ).to.equal(false);

  });

  it('can find the in edges for a node', function() {
    const json = getXFlowJSON('data/flows/10_steps.json');
    const xf = new XFlowStruct(json);
    const nodes = xf.getNodes();

    expect(xf.getInEdges(nodes[0]).length).to.equal(0);
    expect(xf.getInEdges(nodes[1]).length).to.equal(1);
    expect(xf.getInEdges(nodes[nodes.length - 1]).length).to.equal(1);

  });

});

