import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
import tv4 from 'tv4';

import XFlowValidator from '../../lib/xflow-validator';

chai.use(chaiAsPromised);

var goodFlowFiles = [
  'data/flows/10_steps.json',
  'data/flows/arithmetic_addition.json',
  'data/flows/branch_boolean.json',
  'data/flows/branch_boolean_and_expressions_return.json',
  'data/flows/branch_boolean_condition.json',
  'data/flows/create_object.json',
  'data/flows/loop_5x.json'
];

var badFlowFiles = [
  // 'data/bad_flows/bad_capabilities.json', // XXX: Bad cap matches are still schema-valid
  // 'data/invalid_flows/identical_id_nodes.json', // XXX: Identical IDs don't validate
  'data/bad_flows/multiple_entry_nodes.json',
  'data/bad_flows/no_entry_nodes.json'
];

var allFlowFiles = goodFlowFiles.concat(badFlowFiles);

var schemaFile = 'data/schemas/xflow-schema.json';
var schemaData = fs.readFileSync(schemaFile, 'utf-8');
var schemaJSON = JSON.parse(schemaData);

describe('JSON data ', function() {
  it(' all flows should validate ', function() {

    allFlowFiles.forEach(function(file) {
      var data = fs.readFileSync(file, 'utf-8');
      var json = JSON.parse(data);
      var res  = tv4.validate(json, schemaJSON);
      // console.log('XXX', res, ' : ', file);
      expect(res).to.equal(true);
    });
  });

});

describe('JSON data - graph validation ', function() {

    it('should not validate arbitrary JSON ', function() {

      var json = { 'x': 'y' };
      var res  = tv4.validate(json, schemaJSON);
      expect(res).to.equal(false);

      res  = (new XFlowValidator()).validate(json);
      expect(res).to.equal(false);

    });

  it(' all good flows should validate ', function() {
    goodFlowFiles.forEach(function(file) {
      var data = fs.readFileSync(file, 'utf-8');
      var json = JSON.parse(data);
      var res  = (new XFlowValidator()).validate(json);
      expect(res).to.equal(true);
    });
  });

  it(' all bad flows should FAIL to validate ', function() {
    badFlowFiles.forEach(function(file) {
      var data = fs.readFileSync(file, 'utf-8');
      var json = JSON.parse(data);
      var res  = (new XFlowValidator()).validate(json);
      expect(res).to.equal(false);
    });

  });

});



