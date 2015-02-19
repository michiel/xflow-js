var chai           = require('chai');
var should         = chai.should();
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var xflow  = require('../lib/xflow');

var fs = require('fs');

describe('xflow sync ', function() {
    it('loads a json flow', function() {
        var data = fs.readFileSync('data/create_object.json', 'utf-8');
        var json = JSON.parse(data);
        var res = xflow(json, {}).start();
        res.should.equal(true);
      });
  });

describe('xflow async ', function() {
    it('loads a json flow', function() {
        var data = fs.readFileSync('data/create_object.json', 'utf-8');
        var json = JSON.parse(data);
        var res = xflow(json, {}).startQ();
        res.should.eventually.equal(true);
      });
  });

