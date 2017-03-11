import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
import vm from 'vm';

chai.use(chaiAsPromised);

import XFlowJSBuilder from '../../../src/codegen/xflow-js-builder';
import Flox from '../../../src/flox';
import FloxGenerator from '../../../src/codegen/actions/flox_generator';

import XFlowHelper from '../../helper/xflow';

function getXFlow(json, params) {
  return XFlowHelper.getXFlowBasic(json, params);
}

function buildScript(json) {
  const builder = new XFlowJSBuilder(json);
  builder.addGenerator('flox', new FloxGenerator());

  const jscode = builder.generate();
  // console.log('JSCODE ', jscode);
  return new vm.Script(jscode, {
    displayErrors: true,
  });
}

function getEnv(skoop) {
  return {
    scope: skoop || {},
    Flox: {
      'evalexpr': function(exp, scope) {
        // console.log('EXP ', exp, 'SCOPE ', scope);
        const str = Flox.substituteExpression(exp, scope);
        return Flox.parse(str);
      },
    },
  };
}

function loadJson(path) {
  const data = fs.readFileSync(path, 'utf-8');
  return JSON.parse(data);
}

describe('XFlowJSBuilder basic', function() {

  it('loads a json flow and compiles to JS', function() {

    const json = loadJson('data/flows/arithmetic_addition.json');

    const script = buildScript(json);
    const ctxt = vm.createContext(getEnv({
      'ValueA': 4,
      'ValueB': 5,
    }));
    const vmResult = script.runInNewContext(ctxt);
    expect(vmResult).to.deep.equal({
      'ReturnValue': 9,
    });
  });

  it('loads a json flow with a boolean branch and compiles to JS', function() {

    const json = loadJson('data/flows/branch_boolean.json');
    const res = (getXFlow(json, {})).start();
    expect(res).to.deep.equal({
      'ReturnValue': 0,
    });

    const script = buildScript(json);
    const ctxt = vm.createContext(getEnv({
      'MatchValue': false,
    }));
    const vmResult = script.runInNewContext(ctxt);
    expect(vmResult).to.deep.equal(res);
  });

  it('loads a json flow with a flox expression and compiles to JS', function() {

    const json = loadJson('data/flows/loop_5x.json');
    const initScope = {
      'CounterValue': 0,
    };
    const res = (getXFlow(json, initScope)).start();
    expect(res).to.deep.equal({
      'CounterValue': 6,
    });

    const script = buildScript(json);
    const ctxt = vm.createContext(getEnv(initScope));
    const vmResult = script.runInNewContext(ctxt);
    expect(vmResult).to.deep.equal(res);
  });

  it('compiles a flow to JS and calls it without a required parameter', function() {

    const json = loadJson('data/flows/branch_boolean.json');
    const script = buildScript(json);
    const ctxt = vm.createContext(getEnv({ }));

    expect(function() {
      script.runInNewContext(ctxt);
    }).to.throw();

  });

});

