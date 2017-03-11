import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
import vm from 'vm';

chai.use(chaiAsPromised);

import XFlowJSBuilder from '../../src/codegen/xflow-js-builder';

import Flox from '../../src/flox';
import FloxGenerator from '../../src/codegen/actions/flox_generator';

import XFlowHelper from '../helper/xflow';

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
        const str = Flox.substituteExpression(exp, scope);
        // console.log('EXP ', exp, 'SCOPE ', scope, ' TO ', Flox.parse(str));
        return Flox.parse(str);
      },
    },
  };
}

function loadJson(path) {
  const data = fs.readFileSync(path, 'utf-8');
  return JSON.parse(data);
}

describe('XFlow cross-type (interpreter/code) operation', function() {

  it('loads a json and both interprets and execs JS expecting results to be identical', function() {

    const json = loadJson('data/flows/loop_5x.json');

    const initScope = {
      'CounterValue': 0,
    };

    const expectedResult = {
      'CounterValue': 6,
    };

    const interpreterResult = (getXFlow(json, initScope)).start();
    expect(interpreterResult).to.deep.equal(expectedResult);

    const script = buildScript(json);
    const ctxt = vm.createContext(getEnv(initScope));
    const codeResult = script.runInNewContext(ctxt);
    expect(codeResult).to.deep.equal(expectedResult);

    expect(codeResult).to.deep.equal(interpreterResult);
  });

  it('loads a json and both interprets and execs JS expecting results to be identical II', function() {

    const json = loadJson('data/flows/branch_boolean.json');

    const initScope = {
      'MatchValue': false,
    };

    const expectedResult = {
      'ReturnValue': 0,
    };

    const interpreterResult = (getXFlow(json, initScope)).start();
    expect(interpreterResult).to.deep.equal(expectedResult);

    const script = buildScript(json);
    const ctxt = vm.createContext(getEnv(initScope));
    const codeResult = script.runInNewContext(ctxt);
    expect(codeResult).to.deep.equal(expectedResult);

    expect(codeResult).to.deep.equal(interpreterResult);
  });

  it('loads a json and both interprets and execs JS expecting results to be identical III', function() {

    const json = loadJson('data/flows/branch_boolean_and_expressions_return.json');

    const initScope = {
      'MatchValue': true,
    };

    const expectedResult = {
      'ReturnValue': 3,
    };

    const interpreterResult = (getXFlow(json, initScope)).start();
    expect(interpreterResult).to.deep.equal(expectedResult);

    const script = buildScript(json);
    const ctxt = vm.createContext(getEnv(initScope));
    const codeResult = script.runInNewContext(ctxt);
    expect(codeResult).to.deep.equal(expectedResult);

    expect(codeResult).to.deep.equal(interpreterResult);
  });

});

