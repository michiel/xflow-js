import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';

chai.use(chaiAsPromised);

import XFlow                  from '../../src/xflow';
import CallXFlowActions       from '../../src/actions/callxflow_actions';

import XFlowDispatcherHelper  from '../helper/xflow-dispatcher';

function getXFlowDispatcher(args={}) {
  return XFlowDispatcherHelper.getXFlowDispatcherExt({
    'callxflow'   : new CallXFlowActions({
      runner : args.runner
    }).getDispatcher()
  });
}

function getXFlow(json, params) {
  var dispatcher = getXFlowDispatcher();
  return new XFlow(json, params, dispatcher);
}

describe('XFlowDispatcherDynamic [sync]', function() {

  it('loads and executes a flow', function() {
    var data = fs.readFileSync('data/flows/create_object.json', 'utf-8');
    var json = JSON.parse(data);
    var res  = getXFlow(json, {
      'ReturnValue' : true
    }).start();
    expect(res).to.deep.equal({
      'ReturnValue' : true
    });
  });

  it('runs a flow with a boolean expression followed by a branch', function() {
    var data = fs.readFileSync('data/flows/branch_boolean_condition.json', 'utf-8');
    var json = JSON.parse(data);
    var res  = (getXFlow(json, {
      'CalcValueA' : 1,
      'CalcValueB' : 2
    })).start();
    expect(res).to.deep.equal({
      'ReturnValue' : true
    });
  });

});



