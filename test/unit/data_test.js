import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
import tv4 from 'tv4';

chai.use(chaiAsPromised);

var flowFiles = [
  'data/branch_boolean.json',
  'data/create_object.json',
  'data/arithmetic_addition.json',
  'data/bad_flows/multiple_entry_nodes.json'
];

var schemaFile = 'data/xflow-schema.json';
var schemaJSON = fs.readFileSync(schemaFile, 'utf-8');

describe('JSON data ', function() {
  it(' all flows should validate ', function() {

    flowFiles.forEach(function(file) {
      var data = fs.readFileSync(file, 'utf-8');
      var json = JSON.parse(data);
      var res  = tv4.validate(json, schemaJSON);
      expect(res).to.equal(true);
    });
  });

});

