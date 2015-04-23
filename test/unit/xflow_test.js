import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';

chai.use(chaiAsPromised);

import XFlow from '../../lib/xflow';
import XFlowDispatcher from '../../lib/xflow-dispatcher';

function getXFlow(json, params) {
  var dispatcher = new XFlowDispatcher();
  return new XFlow(json, params, dispatcher);
}

describe('XFlow sync ', function() {

    it('loads a json flow', function() {
        var data = fs.readFileSync('data/flows/create_object.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {
          'ReturnValue' : true
        })).start();
        expect(res).to.deep.equal({
          'ReturnValue' : true
        });
      });

    it('runs a flow with an arithmetic expression ', function() {
        var data = fs.readFileSync('data/flows/arithmetic_addition.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {})).start();
        expect(res).to.deep.equal({ 'ReturnValue': 3 });
      });

    it('runs a flow with a branch  ', function() {
        var data = fs.readFileSync('data/flows/branch_boolean.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {})).start();
        expect(res).to.deep.equal({});
      });

    it('runs a flow with a branch followed by an expression (1+2)', function() {
        var data = fs.readFileSync('data/flows/branch_boolean_and_expressions_return.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {
          'MatchValue' : true
        })).start();
        expect(res).to.deep.equal({
          'ReturnValue' : 3
        });
      });

    it('runs a flow with a branch followed by an expression (1+2)', function() {
        var data = fs.readFileSync('data/flows/branch_boolean_and_expressions_return.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {
          'MatchValue' : false
        })).start();
        expect(res).to.deep.equal({
          'ReturnValue' : 6
        });
      });

    it('runs a flow with a boolean expression followed by a branch', function() {
        var data = fs.readFileSync('data/flows/branch_boolean_condition.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {
          'CalcValueA' : 1,
          'CalcValueB' : 2
        })).start();
        expect(res).to.deep.equal({
          'ReturnValue' : true
        });
      });

    it('runs a flow with a counter, loop and branch', function() {
        var data = fs.readFileSync('data/flows/loop_5x.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {
          'CounterValue' : 0
        })).start();
        expect(res).to.deep.equal({
          'CounterValue' : 6
        });
      });
  });

describe('XFlow async ', function() {

    it('loads a json flow', function(done) {
        var data = fs.readFileSync('data/flows/create_object.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {
          'ReturnValue' : 2
        })).startQ();
        expect(res).to.eventually.deep.equal({
          'ReturnValue' : 2
        }).notify(done);
      });

    it('runs a flow with an arithmetic expression ', function(done) {
        var data = fs.readFileSync('data/flows/arithmetic_addition.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {})).startQ();
        expect(res).to.eventually.deep.equal({
            'ReturnValue' : 3
          }).notify(done);
      });

    it('runs a flow with a branch  ', function(done) {
        var data = fs.readFileSync('data/flows/branch_boolean.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {})).startQ();
        expect(res).to.eventually.deep.equal({}).notify(done);
      });

    it('runs a flow with a branch followed by an expression (1+2)', function(done) {
        var data = fs.readFileSync('data/flows/branch_boolean_and_expressions_return.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {
          'MatchValue' : true
        })).startQ();
        expect(res).to.eventually.deep.equal({
          'ReturnValue' : 3
        }).notify(done);
      });

    it('runs a flow with a branch followed by an expression (1+2)', function(done) {
        var data = fs.readFileSync('data/flows/branch_boolean_and_expressions_return.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {
          'MatchValue' : false
        })).startQ();
        expect(res).to.eventually.deep.equal({
          'ReturnValue' : 6
        }).notify(done);
      });

    it('runs a flow with a counter, loop and branch', function(done) {
        var data = fs.readFileSync('data/flows/loop_5x.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {
          'CounterValue' : 0
        })).startQ();
        expect(res).to.eventually.deep.equal({
          'CounterValue' : 6
        }).notify(done);
      });
  });

