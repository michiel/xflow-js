import chai           from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs             from 'fs';
import vm             from 'vm';

chai.use(chaiAsPromised);

import XFlow           from '../../../lib/xflow';
import XFlowDispatcher from '../../../lib/xflow-dispatcher';
import XFlowJSBuilder  from '../../../lib/codegen/xflow-js-builder';

import Flox            from '../../../lib/flox';

function getXFlow(json, params) {
  var dispatcher = new XFlowDispatcher();
  return new XFlow(json, params, dispatcher);
}

function buildScript(json) {
  var builder  = new XFlowJSBuilder(json);
  var jscode   = builder.generate();
  // console.log('JSCODE ', jscode);
  return new vm.Script(jscode, {
    displayErrors : true
  });
}

function getEnv() {
  return {
    scope : {
      CounterValue : 0,
      LoopValue    : false
    },
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

    var json = loadJson('data/flows/create_object.json');
    var skope = {
      scope : {}
    };
    var res = (getXFlow(json, {})).start();
    expect(res).to.deep.equal([{}]);

    var script   = buildScript(json);
    var ctxt     = vm.createContext(skope);
    var vmResult = script.runInNewContext(ctxt);
    expect(vmResult).to.deep.equal(res);
  });

  it('loads a json flow with a boolean branch and compiles to JS', function() {

    var json = loadJson('data/flows/branch_boolean.json');
    var skope = {
      scope : {}
    };
    var res = (getXFlow(json, {})).start();
    expect(res).to.deep.equal([{}]);

    var script   = buildScript(json);
    var ctxt     = vm.createContext(skope);
    var vmResult = script.runInNewContext(ctxt);
    expect(vmResult).to.deep.equal(res);
  });

  it('loads a json flow with a flox expression and compiles to JS', function() {

    var json = loadJson('data/flows/loop_5x.json');
    var skope = getEnv();
//     skope.scope = {
//       CounterValue : 0,
//       LoopValue    : 0
//     };
    // var res = (getXFlow(json, {})).start();
    // expect(res).to.deep.equal([{}]);

    var out = [{
      CounterValue : 6,
      LoopValue    : true
    }];
    var script   = buildScript(json);
    var ctxt     = vm.createContext(skope);
    var vmResult = script.runInNewContext(ctxt);
    expect(vmResult).to.deep.equal(out);
  });

});

