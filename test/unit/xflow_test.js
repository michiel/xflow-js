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
        expect(res).to.deep.equal({
          'ReturnValue': 3
        });
      });

    it('runs a flow with a branch  ', function() {
        var data = fs.readFileSync('data/flows/branch_boolean.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {})).start();
        expect(res).to.deep.equal({
          'ReturnValue' : 0
        });
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

    it('loads a json flow', function() {
        var data = fs.readFileSync('data/flows/create_object.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {
          'ReturnValue' : 2
        })).startQ();
        return expect(res).to.eventually.deep.equal({
          'ReturnValue' : 2
        });
      });

    it('runs a flow with an arithmetic expression ', function() {
        var data = fs.readFileSync('data/flows/arithmetic_addition.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {})).startQ();
        return expect(res).to.eventually.deep.equal({
            'ReturnValue' : 3
          });
      });

    it('runs a flow with a branch  ', function() {
        var data = fs.readFileSync('data/flows/branch_boolean.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {})).startQ();
        return expect(res).to.eventually.deep.equal({
          'ReturnValue' : 0
        });
      });

    it('runs a flow with a branch followed by an expression (1+2)', function() {
        var data = fs.readFileSync('data/flows/branch_boolean_and_expressions_return.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {
          'MatchValue' : true
        })).startQ();
        return expect(res).to.eventually.deep.equal({
          'ReturnValue' : 3
        });
      });

    it('runs a flow with a branch followed by an expression (1+2)', function() {
        var data = fs.readFileSync('data/flows/branch_boolean_and_expressions_return.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {
          'MatchValue' : false
        })).startQ();
        return expect(res).to.eventually.deep.equal({
          'ReturnValue' : 6
        });
      });

    it('runs a flow with a counter, loop and branch', function() {
        var data = fs.readFileSync('data/flows/loop_5x.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {
          'CounterValue' : 0
        })).startQ();
        return expect(res).to.eventually.deep.equal({
          'CounterValue' : 6
        });
      });
  });

describe('XFlow initialization', function() {

  it('throws an error if intialized without flow data', function() {
    expect(function() {
      var xf = new XFlow();
      xf.getNodes(); // satisfy jshint with null op
    }).to.throw(Error);
  });

  it('throws an error if intialized without a dispatcher', function() {
    expect(function() {
      var xf = new XFlow({});
      xf.getNodes(); // satisfy jshint with null op
    }).to.throw(Error);
  });

  it('throws an error if activeNode is set to same node', function() {
    var data = fs.readFileSync('data/flows/branch_boolean_and_expressions_return.json', 'utf-8');
    var json = JSON.parse(data);
    var xf = getXFlow(json, {
      'MatchValue' : false
    });
    var nodes = xf.flow.getNodes();
    expect(function() {
      xf.setActiveNode(nodes[0]);
    }).to.throw(Error);

  });

});

describe('XFlow save/restore', function() {

  it('it can save a state', function() {
    var data = fs.readFileSync('data/flows/loop_5x.json', 'utf-8');
    var json = JSON.parse(data);
    var xflow = (getXFlow(json, {
      'CounterValue' : 0
    }));
    xflow.nextStep();
    var savedState = xflow.save();
    xflow.nextStep();
    expect(xflow.save()).to.not.deep.equal(savedState);
  });

  it('it can save and restore a state', function() {
    var data = fs.readFileSync('data/flows/loop_5x.json', 'utf-8');
    var json = JSON.parse(data);
    var xflow = (getXFlow(json, {
      'CounterValue' : 0
    }));
    xflow.nextStep();
    xflow.nextStep();

    var savedState = xflow.save();

    xflow.nextStep();

    var nextSavedState = xflow.save();

    xflow.nextStep();

    xflow.restore(savedState);

    xflow.nextStep();

    expect(xflow.save()).to.deep.equal(nextSavedState);
  });

});

