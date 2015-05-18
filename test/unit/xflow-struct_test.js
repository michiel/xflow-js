import chai           from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs             from 'fs';

chai.use(chaiAsPromised);

import XFlowStruct  from '../../lib/xflow-struct';

function getXFlowJSON(path) {
  var data = fs.readFileSync(path, 'utf-8');
//   try {
//     JSON.parse(data);
//   } catch(e) {
//     console.log('The offending file is : ', path);
//   }
  return JSON.parse(data);
}

describe('XFlowstruct ', function() {

  it('can get all variables ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowStruct(json);

    var xvars = xf.getVariables();

    expect(xvars.in.length).to.equal(1);
    expect(xvars.out.length).to.equal(1);
    expect(xvars.local.length).to.equal(0);
  });

  it('can get in variables ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowStruct(json);

    var xvars = xf.getInVariables();
    expect(xvars.length).to.equal(1);
  });

  it('can get out variables ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowStruct(json);

    var xvars = xf.getOutVariables();
    expect(xvars.length).to.equal(1);
  });

  it('can get local variables ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowStruct(json);

    var xvars = xf.getLocalVariables();
    expect(xvars.length).to.equal(0);
  });

  it('can get the version ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowStruct(json);

    expect(xf.getVersion()).to.equal(1);
  });

  it('can get the name ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowStruct(json);

    expect(xf.getName()).to.equal('steps');
  });

  it('can get the ID ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowStruct(json);

    expect(xf.getId()).to.equal('steps');
  });

  it('can get the requirements ', function() {
    var json      = getXFlowJSON('data/flows/10_steps.json');
    var xf        = new XFlowStruct(json);

    expect(xf.getRequirements()).to.deep.equal([
      {
        'xtype': 'flow',
        'version': 1
      },
      {
        'xtype': 'flox',
        'version': 1
      }
    ]);
  });

});


