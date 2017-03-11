import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';

chai.use(chaiAsPromised);

import XFlowValidator from '../../src/xflow-validator';

function getXFlowJSON(path) {
  const data = fs.readFileSync(path, 'utf-8');
//   try {
//     JSON.parse(data);
//   } catch(e) {
//     console.log('The offending file is : ', path);
//   }
  return JSON.parse(data);
}

describe('XFlowValidator loads bad flows ', function() {

  it('with multiple entries and returns validation errors ', function() {
    const json = getXFlowJSON('data/bad_flows/multiple_entry_nodes.json');
    const validator = new XFlowValidator();
    const res = validator.validateWithErrors(json);

    expect(res.length).to.not.equal(0);
  });

  it('with an unreferenced variable returns validation errors ', function() {
    const json = getXFlowJSON('data/bad_flows/unreferenced_variables.json');
    const validator = new XFlowValidator();
    const res = validator.validateWithErrors(json);

    expect(res.length).to.equal(1);
  });

  it('with edges without corresponding nodes and returns validation errors ', function() {
    const json = getXFlowJSON('data/bad_flows/edges_without_nodes.json');
    const validator = new XFlowValidator();
    const res = validator.validateWithErrors(json);

    expect(res.length).to.equal(3);
  });

  it('with unmatched capability requirements and returns validation errors ', function() {
    const json = getXFlowJSON('data/bad_flows/bad_capabilities.json');
    const validator = new XFlowValidator();
    const res = validator.validateWithErrors(json);

    expect(res.length).to.equal(2);
  });

  it('without an entry node and returns validation errors ', function() {
    const json = getXFlowJSON('data/bad_flows/no_entry_nodes.json');
    const validator = new XFlowValidator();
    const res = validator.validateWithErrors(json);

    expect(res.length).to.equal(1);
  });

  it('without a terminal nodes and returns validation errors ', function() {
    const json = getXFlowJSON('data/bad_flows/no_terminal_nodes.json');
    const validator = new XFlowValidator();
    const res = validator.validateWithErrors(json);

    expect(res.length).to.equal(1);
  });

  it('with out signature that reference unavailable variables and returns validation errors ', function() {
    const json = getXFlowJSON('data/bad_flows/unreferenced_variables.json');
    const validator = new XFlowValidator();
    const res = validator.validateWithErrors(json);

    expect(res.length).to.equal(1);
  });

  it('with flox expression that references unavailable variables and returns validation errors ', function() {
    const json = getXFlowJSON('data/bad_flows/unreferenced_variables_in_flox.json');
    const validator = new XFlowValidator();
    const res = validator.validateWithErrors(json);

    expect(res.length).to.equal(1);
  });

  it('with input variable redefined in local variables and returns  validation errors ', function() {
    const json = getXFlowJSON('data/bad_flows/redefined_local_variables.json');
    const validator = new XFlowValidator();
    const res = validator.validateWithErrors(json);

    expect(res.length).to.equal(1);
  });

  it('with double defined variables in local, input and output it returns validation errors ', function() {
    const json = getXFlowJSON('data/bad_flows/double_variables_per_scope.json');
    const validator = new XFlowValidator();
    const res = validator.validateWithErrors(json);

    expect(res.length).to.equal(3);
  });

});

describe('XFlowValidator gets called with bad arguments ', function() {

  it('validate invoked with no arguments ', function() {
    const validator = new XFlowValidator();
    expect(function() {
      validator.validate();
    }).to.throw(Error);
  });

  it('validateWithErrors invoked with no arguments ', function() {
    const validator = new XFlowValidator();
    expect(function() {
      validator.validateWithErrors();
    }).to.throw(Error);
  });

});

describe('XFlowValidator gets called with invalid schemas', function() {

  it('validate invoked with an invalid schema', function() {
    const validator = new XFlowValidator();
    const json = getXFlowJSON('data/invalid_flows/identical_id_nodes.json');

    const res = validator.validate(json);
    expect(res).to.equal(false);
  });

  it('validateWithErrors invoked with an invalid schema', function() {
    const validator = new XFlowValidator();
    const json = getXFlowJSON('data/invalid_flows/identical_id_nodes.json');

    const res = validator.validateWithErrors(json);
    expect(res.length).to.equal(1);
  });

});

