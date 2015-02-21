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


    it('runs a flow with an arithmetic expression ', function() {
        var data = fs.readFileSync('data/arithmetic_addition.json', 'utf-8');
        var json = JSON.parse(data);
        var res = xflow(json, {}).start();
        res.should.equal(4);
      });

  });

describe('xflow async ', function() {
    it('loads a json flow', function() {
        var data = fs.readFileSync('data/create_object.json', 'utf-8');
        var json = JSON.parse(data);
        var res = xflow(json, {}).startQ();
        res.then(function(x) {
            console.log('xxxxx');
            x.should.equal(true);
            return x;
          });
        // res.should.eventually.equal(true);
      });
  });

