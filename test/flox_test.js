var chai           = require('chai');
var should         = chai.should();
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var flox  = require('../lib/flox');

var parse                = flox.parse;
var evaluateExpression   = flox.evaluateExpression;
var substituteExpression = flox.substituteExpression;

describe('flox sync parse ', function() {

    it('parses an expression without variables "1+2"', function() {
        var res = parse('1+2');
        res.should.equal(3);
      });
  });

describe('flox sync substituteExpression ', function() {


    it('should substitute nothing in an expression without variables "1+2"', function() {
        var expr = '1+2';
        var res = substituteExpression(expr, {});
        res.should.equal(expr);
      });

    it('should substitute 123456 in an expression with variable "$A"', function() {
        var expr = '$A+2';
        var res = substituteExpression(expr, {
            'A' : 123456
          });
        res.should.equal('123456+2');
      });

    it('should substitute multiple values in an expression', function() {
        var expr = '$A+$B+$C';
        var res = substituteExpression(expr, {
            'A' : 444444,
            'B' : 555555,
            'C' : 666666
          });
        res.should.equal('444444+555555+666666');
      });

    it('should substitute multiple instances of the same value in an expression', function() {
        var expr = '$A+$A+$A';
        var res = substituteExpression(expr, {
            'A' : 444444
          });
        res.should.equal('444444+444444+444444');
      });

  });

describe('flox sync substitute and parse ', function() {

    it('subs and parses an expression without variables "1+2"', function() {
        var sub = substituteExpression('1+2', {});
        var res = parse(sub);
        res.should.equal(3);
      });

    it('subs and parses an expression with a variable', function() {

        var sub = substituteExpression('$A+2', {
            'A' : 1
          });
        var res = parse(sub);
        res.should.equal(3);
      });

    it('subs and parses an expression with multiple variables', function() {

        var sub = substituteExpression('$A+$B+$C', {
            'A' : 1,
            'B' : 2,
            'C' : 3
          });
        var res = parse(sub);
        res.should.equal(6);
      });

  });

describe('flox flow invocation ', function() {

    it('evaluates an expression without variables "1+2"', function() {

        var node = {
          "id"     : 2,
          "type"   : "flow",
          "action" : "flox-arithmetic",
          "parameters": {
            "expression" : "1+2",
            "returns"    : {
              "name"   : "result",
              "type"   : "number"
            }
          }
        };

        var state = evaluateExpression(node, {});
        state.result.should.equal(3);
      });

    it('evaluates an expression with variables "$A+$B"', function() {

        var node = {
          "id"     : 2,
          "type"   : "flow",
          "action" : "flox-arithmetic",
          "parameters": {
            "expression" : "$A+$B",
            "returns"    : {
              "name"   : "result",
              "type"   : "number"
            }
          }
        };

        var state = evaluateExpression(node, {
            'A' : 1,
            'B' : 2
          });

        state.result.should.equal(3);

      });

  });
