import chai           from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs             from 'fs';

chai.use(chaiAsPromised);

import XFlowValidator  from '../../lib/xflow-validator';

function getXFlowJSON(path) {
  var data = fs.readFileSync(path, 'utf-8');
  return JSON.parse(data);
}

describe('XFlowValidator load bad flow ', function() {

    it('loads a json flow with multiple entries and returns validation errors ', function() {
      var json      = getXFlowJSON('data/bad_flows/multiple_entry_nodes.json');
      var validator = new XFlowValidator();
      var res       = validator.validateWithErrors(json);

      expect(res.length).to.not.equal(0);
    });

    it('loads a json flow with an unreferenced variable returns validation errors ', function() {
      var json      = getXFlowJSON('data/bad_flows/unreferenced_variables.json');
      var validator = new XFlowValidator();
      var res       = validator.validateWithErrors(json);

      expect(res.length).to.equal(1);
    });

    it('loads a json flow with edges without corresponding nodes and returns validation errors ', function() {
      var json      = getXFlowJSON('data/bad_flows/edges_without_nodes.json');
      var validator = new XFlowValidator();
      var res       = validator.validateWithErrors(json);

      expect(res.length).to.equal(3);
    });

    it('loads a json flow with unmatched capability requirements and returns validation errors ', function() {
      var json      = getXFlowJSON('data/bad_flows/bad_capabilities.json');
      var validator = new XFlowValidator();
      var res       = validator.validateWithErrors(json);

      expect(res.length).to.equal(2);
    });

    it('loads a json flow without an entry node and returns validation errors ', function() {
      var json      = getXFlowJSON('data/bad_flows/no_entry_nodes.json');
      var validator = new XFlowValidator();
      var res       = validator.validateWithErrors(json);

      expect(res.length).to.equal(1);
    });

    it('loads a json flow without a terminal nodes and returns validation errors ', function() {
      var json      = getXFlowJSON('data/bad_flows/no_terminal_nodes.json');
      var validator = new XFlowValidator();
      var res       = validator.validateWithErrors(json);

      expect(res.length).to.equal(1);
    });

    it('loads a json flow with out signature that reference unavailable variables and returns validation errors ', function() {
      var json      = getXFlowJSON('data/bad_flows/unreferenced_variables.json');
      var validator = new XFlowValidator();
      var res       = validator.validateWithErrors(json);
      console.log(res);

      expect(res.length).to.equal(1);
    });

    it('loads a json flow with flox expression that references unavailable variables and returns validation errors ', function() {
      var json      = getXFlowJSON('data/bad_flows/unreferenced_variables_in_flox.json');
      var validator = new XFlowValidator();
      var res       = validator.validateWithErrors(json);
      console.log(res);

      expect(res.length).to.equal(1);
    });


});

