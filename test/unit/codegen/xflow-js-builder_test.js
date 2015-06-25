import chai           from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs             from 'fs';
import vm             from 'vm';

chai.use(chaiAsPromised);

import XFlow           from '../../../lib/xflow';
import XFlowDispatcher from '../../../lib/xflow-dispatcher';
import XFlowJSBuilder  from '../../../lib/codegen/xflow-js-builder';

import Flox            from '../../../lib/flox';

import FloxGenerator   from '../../../lib/codegen/actions/flox_generator';

function getXFlow(json, params) {
  var dispatcher = new XFlowDispatcher();
  return new XFlow(json, params, dispatcher);
}

function buildScript(json) {
  var builder  = new XFlowJSBuilder(json);
  builder.addGenerator('flox', new FloxGenerator());

  var jscode   = builder.generate();
  // console.log('JSCODE ', jscode);
  return new vm.Script(jscode, {
    displayErrors : true
  });
}

function getEnv(skoop) {
  return {
    scope : skoop || {},
    Flox  : {
      'evalexpr' : function(exp, scope) {
        // console.log('EXP ', exp, 'SCOPE ', scope);
        var str = Flox.substituteExpression(exp, scope);
        return Flox.parse(str);
      }
    }
  };
}

function loadJson(path) {
  var data = fs.readFileSync(path, 'utf-8');
  return JSON.parse(data);
}

describe('XFlowJSBuilder basic', function() {

  it('loads a json flow and compiles to JS', function() {

    var json = loadJson('data/flows/arithmetic_addition.json');

    var script   = buildScript(json);
    var ctxt     = vm.createContext(getEnv({
      'ValueA' : 4,
      'ValueB' : 5
    }));
    var vmResult = script.runInNewContext(ctxt);
    expect(vmResult).to.deep.equal({
      'ReturnValue' : 9
    });
  });

  it('loads a json flow with a boolean branch and compiles to JS', function() {

    var json = loadJson('data/flows/branch_boolean.json');
    var res = (getXFlow(json, {})).start();
    expect(res).to.deep.equal({
      'ReturnValue' : 0
    });

    var script   = buildScript(json);
    var ctxt     = vm.createContext(getEnv({
      'MatchValue'  : false
    }));
    var vmResult = script.runInNewContext(ctxt);
    expect(vmResult).to.deep.equal(res);
  });

  it('loads a json flow with a flox expression and compiles to JS', function() {

    var json = loadJson('data/flows/loop_5x.json');
    var initScope = {
      'CounterValue' : 0
    };
    var res = (getXFlow(json, initScope)).start();
    expect(res).to.deep.equal({
      'CounterValue' : 6
    });

    var script   = buildScript(json);
    var ctxt     = vm.createContext(getEnv(initScope));
    var vmResult = script.runInNewContext(ctxt);
    expect(vmResult).to.deep.equal(res);
  });

  it('compiles a flow to JS and calls it without a required parameter', function() {

    var json = loadJson('data/flows/branch_boolean.json');
    var script   = buildScript(json);
    var ctxt     = vm.createContext(getEnv({ }));

    expect(function() {
      script.runInNewContext(ctxt);
    }).to.throw();

  });


});

