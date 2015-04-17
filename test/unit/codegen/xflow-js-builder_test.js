import chai           from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs             from 'fs';
import vm             from 'vm';

chai.use(chaiAsPromised);

import XFlow           from '../../../lib/xflow';
import XFlowDispatcher from '../../../lib/xflow-dispatcher';
import XFlowJSBuilder  from '../../../lib/codegen/xflow-js-builder';

function getXFlow(json, params) {
  var dispatcher = new XFlowDispatcher();
  return new XFlow(json, params, dispatcher);
}

describe('XFlowJSBuilder basic', function() {

  it('loads a json flow and compiles to JS', function() {

    var data = fs.readFileSync('data/flows/create_object.json', 'utf-8');
    var json = JSON.parse(data);
    var res = (getXFlow(json, {})).start();
    expect(res).to.deep.equal([{}]);

    var builder  = new XFlowJSBuilder(json);
    var jscode   = builder.generateX();
    var vmResult = vm.runInThisContext(jscode);
    expect(vmResult).to.deep.equal(res);
    // expect(jscode).to.deep.equal(res);

  });

  it('loads a json flow XXX and compiles to JS', function() {

    var data = fs.readFileSync('data/flows/branch_boolean.json', 'utf-8');
    var json = JSON.parse(data);
    var res = (getXFlow(json, {})).start();
    expect(res).to.deep.equal([{}]);

    var builder  = new XFlowJSBuilder(json);
    var jscode   = builder.generateX();
    var vmResult = vm.runInThisContext(jscode);
    expect(vmResult).to.deep.equal(res);
    // expect(jscode).to.deep.equal(res);

  });

});

