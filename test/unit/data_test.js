import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
import tv4 from 'tv4';

import XFlowValidator from '../../lib/xflow-validator';

chai.use(chaiAsPromised);

var goodFlowFiles = [
  'data/branch_boolean.json',
  'data/create_object.json',
  'data/arithmetic_addition.json'
];

var badFlowFiles = [
  'data/bad_flows/multiple_entry_nodes.json'
];

var allFlowFiles = goodFlowFiles.concat(badFlowFiles);

var schemaFile = 'data/xflow-schema.json';
var schemaJSON = fs.readFileSync(schemaFile, 'utf-8');

describe('JSON data ', function() {
  it(' all flows should validate ', function() {

    allFlowFiles.forEach(function(file) {
      var data = fs.readFileSync(file, 'utf-8');
      var json = JSON.parse(data);
      var res  = tv4.validate(json, schemaJSON);
      expect(res).to.equal(true);
    });
  });

});

describe('JSON data - graph validation ', function() {

  it(' all good flows should validate ', function() {
    goodFlowFiles.forEach(function(file) {
      var data = fs.readFileSync(file, 'utf-8');
      var json = JSON.parse(data);
      var res  = (new XFlowValidator(json, schemaJSON)).validate();
      expect(res).to.equal(true);
    });
  });

  it(' all bad flows should FAIL to validate ', function() {
    badFlowFiles.forEach(function(file) {
      var data = fs.readFileSync(file, 'utf-8');
      var json = JSON.parse(data);
      var res  = (new XFlowValidator(json, schemaJSON)).validate();
      expect(res).to.equal(false);
    });
  });

});



