import chai           from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs             from 'fs';

chai.use(chaiAsPromised);

import XFlowFactory           from '../../lib/xflow-factory';
import XFlowQRunner           from '../../lib/xflow-qrunner';
import XFlowDispatcherDynamic from '../../lib/xflow-dispatcher-dynamic';

import FlowActions   from '../../lib/actions/flow_actions';
import FloxActions   from '../../lib/actions/flox_actions';
import ObjectActions from '../../lib/actions/object_actions';

var stdDispatcherDefs = {
  'flox' : {
    'name'      : 'flox',
    'version'   : 1,
    'dispatch'  : FloxActions.Dispatch,
    'dispatchQ' : FloxActions.DispatchQ
  },
  'object' : {
    'name'      : 'object',
    'version'   : 1,
    'dispatch'  : ObjectActions.Dispatch,
    'dispatchQ' : ObjectActions.DispatchQ
  },
  'flow' : {
    'name'      : 'flow',
    'version'   : 1,
    'dispatch'  : FlowActions.Dispatch,
    'dispatchQ' : FlowActions.DispatchQ
  }
};

function getInstances() {
  var dispatcher = new XFlowDispatcherDynamic();
  var factory    = new XFlowFactory(dispatcher);
  var runner     = new XFlowQRunner({
    factory   : factory
  });

  dispatcher.addDispatchers(stdDispatcherDefs);

  return {
    runner     : runner,
    factory    : factory,
    dispatcher : dispatcher
  };
}

function loadJson(path) {
  var data = fs.readFileSync(path, 'utf-8');
  return JSON.parse(data);
}

describe('Cross-flow, basic dynamic dispatch invocations', function() {

  it('can call an xflow I', function() {
    var json = loadJson('data/flows/create_object.json', 'utf-8');
    var instances = getInstances();

    instances.runner.addFlow(json);

    var res = instances.runner.run(json.id, {
      'ReturnValue' : true
    });

    expect(res).to.deep.equal({
      'ReturnValue' : true
    });
  });

  it('can call an xflow II', function() {
    var json = loadJson('data/flows/loop_5x.json', 'utf-8');
    var instances = getInstances();

    instances.runner.addFlow(json);

    var res = instances.runner.run(json.id, {
      'CounterValue' : 0
    });

    expect(res).to.deep.equal({
      'CounterValue' : 6
    });
  });

  it('can call an xflow III', function() {
    var json = loadJson('data/flows/branch_boolean_condition.json', 'utf-8');
    var instances = getInstances();

    instances.runner.addFlow(json);

    var res = instances.runner.run(json.id, {
      'CalcValueA' : 1,
      'CalcValueB' : 2
    });

    expect(res).to.deep.equal({
      'ReturnValue' : true
    });
  });

});

