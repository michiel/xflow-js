import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

import Flox  from '../../lib/flox';

var parse                = Flox.parse;
var evaluateExpression   = Flox.evaluateExpression;
var substituteExpression = Flox.substituteExpression;

describe('flox sync parse ', function() {

    it('parses an expression without variables "1+2"', function() {
        var res = parse('1+2');
        expect(res).to.equal(3);
      });
  });

describe('flox sync substituteExpression ', function() {


    it('should substitute nothing in an expression without variables "1+2"', function() {
        var expr = '1+2';
        var res = substituteExpression(expr, {});
        expect(res).to.equal(expr);
      });

    it('should substitute 123456 in an expression with variable "$A"', function() {
        var expr = '$A+2';
        var res = substituteExpression(expr, {
            'A' : 123456
          });
        expect(res).to.equal('123456+2');
      });

    it('should substitute multiple values in an expression', function() {
        var expr = '$A+$B+$C';
        var res = substituteExpression(expr, {
            'A' : 444444,
            'B' : 555555,
            'C' : 666666
          });
        expect(res).to.equal('444444+555555+666666');
      });

    it('should substitute multiple instances of the same value in an expression', function() {
        var expr = '$A+$A+$A';
        var res = substituteExpression(expr, {
            'A' : 444444
          });
        expect(res).to.equal('444444+444444+444444');
      });

    it('should thow an Error when using null or undefined values in an expression', function() {
        var expr = '$A+$A+$A';
        expect(
          function() {
            substituteExpression(expr, {
              'A' : null
            });
          }
        ).to.throw(Error);
      });

  });

describe('flox sync substitute and parse ', function() {

    it('subs and parses an expression without variables "1+2"', function() {
        var sub = substituteExpression('1+2', {});
        var res = parse(sub);
        expect(res).to.equal(3);
      });

    it('subs and parses an expression with a variable', function() {

        var sub = substituteExpression('$A+2', {
            'A' : 1
          });
        var res = parse(sub);
        expect(res).to.equal(3);
      });

    it('subs and parses an expression with multiple variables', function() {

        var sub = substituteExpression('$A+$B+$C', {
            'A' : 1,
            'B' : 2,
            'C' : 3
          });
        var res = parse(sub);
        expect(res).to.equal(6);
      });

  });

describe('flox flow invocation ', function() {

    it('evaluates an expression without variables "1+2"', function() {

        var node = {
          'id'       : 2,
          'nodetype' : 'flow',
          'action'   : 'flox-arithmetic',
          'parameters': {
            'expression' : '1+2',
            'returns'    : {
              'name'   : 'result',
              'vtype'  : 'number'
            }
          }
        };

        var state = evaluateExpression(node, {});
        expect(state.result).to.equal(3);
      });

    it('evaluates an expression with variables "$A+$B"', function() {

        var node = {
          'id'       : 2,
          'nodetype' : 'flow',
          'action'   : 'flox-arithmetic',
          'parameters': {
            'expression' : '$A+$B',
            'returns'    : {
              'name'   : 'result',
              'vtype'  : 'number'
            }
          }
        };

        var state = evaluateExpression(node, {
            'A' : 1,
            'B' : 2
          });

        expect(state.result).to.equal(3);

      });

  });
