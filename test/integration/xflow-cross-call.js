import chai           from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs             from 'fs';
import RSVP           from 'rsvp';

chai.use(chaiAsPromised);

import XFlowFactory           from '../../lib/xflow-factory';
import XFlowRunner            from '../../lib/xflow-runner';
import XFlowDispatcherDynamic from '../../lib/xflow-dispatcher-dynamic';

import FlowActions   from '../../lib/actions/flow_actions';
import FloxActions   from '../../lib/actions/flox_actions';
import ObjectActions from '../../lib/actions/object_actions';

import CallXFlowActions from '../../lib/actions/callxflow_actions';

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
  var runner     = new XFlowRunner({
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

describe('Cross-flow, basic dynamic dispatch invocations [sync]', function() {

  it('can call an xflow I', function() {
    var json = loadJson('data/flows/create_object.json');
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
    var json = loadJson('data/flows/loop_5x.json');
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
    var json = loadJson('data/flows/branch_boolean_condition.json');
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

describe('Cross-flow, basic dynamic dispatch invocations [async]', function() {

  it('can call an xflow I', function() {
    var json = loadJson('data/flows/create_object.json');
    var instances = getInstances();

    instances.runner.addFlow(json);

    var res = instances.runner.runQ(json.id, {
      'ReturnValue' : true
    });

    return expect(res).to.eventually.deep.equal({
      'ReturnValue' : true
    });
  });

  it('can call an xflow II', function() {
    var json = loadJson('data/flows/loop_5x.json');
    var instances = getInstances();

    instances.runner.addFlow(json);

    var res = instances.runner.runQ(json.id, {
      'CounterValue' : 0
    });

    return expect(res).to.eventually.deep.equal({
      'CounterValue' : 6
    });
  });

  it('can call an xflow III', function() {
    var json = loadJson('data/flows/branch_boolean_condition.json');
    var instances = getInstances();

    instances.runner.addFlow(json);

    var res = instances.runner.runQ(json.id, {
      'CalcValueA' : 1,
      'CalcValueB' : 2
    });

    return expect(res).to.eventually.deep.equal({
      'ReturnValue' : true
    });
  });

});

describe('Cross-flow, call other xflow [sync]', function() {

  it('can call another xflow', function() {
    var instances = getInstances();

    var json1 = loadJson('data/capability_flows/add_1.json');
    var json2 = loadJson('data/capability_flows/xflow-call-xflow.json');

    instances.runner.addFlow(json1);
    instances.runner.addFlow(json2);

    var callXFlowActions = new CallXFlowActions({
      runner: instances.runner
    });

    instances.dispatcher.addDispatcher(
      'callxflow', callXFlowActions.getDispatcher()
    );

    var res;

    res = instances.runner.run(json2.id, {
    });

    expect(res).to.deep.equal({
      'CounterValue' : 1
    });

    res = instances.runner.run(json2.id, {
      'CounterValue' : 1
    });

    expect(res).to.deep.equal({
      'CounterValue' : 2
    });

  });

  it('can call another xflow multiple times', function() {
    var instances = getInstances();

    var json1 = loadJson('data/capability_flows/add_1.json');
    var json2 = loadJson('data/capability_flows/xflow-call-xflow-3x.json');

    instances.runner.addFlow(json1);
    instances.runner.addFlow(json2);

    var callXFlowActions = new CallXFlowActions({
      runner: instances.runner
    });

    instances.dispatcher.addDispatcher(
      'callxflow', callXFlowActions.getDispatcher()
    );

    var res;

    res = instances.runner.run(json2.id, {
    });

    expect(res).to.deep.equal({
      'CounterValue' : 3
    });

    res = instances.runner.run(json2.id, {
      'CounterValue' : 3
    });

    expect(res).to.deep.equal({
      'CounterValue' : 6
    });

  });

});

describe('Cross-flow, call other xflow [async]', function() {

  it('can call another xflow', function() {
    var instances = getInstances();

    var json1 = loadJson('data/capability_flows/add_1.json');
    var json2 = loadJson('data/capability_flows/xflow-call-xflow.json');

    instances.runner.addFlow(json1);
    instances.runner.addFlow(json2);

    var callXFlowActions = new CallXFlowActions({
      runner: instances.runner
    });

    instances.dispatcher.addDispatcher(
      'callxflow', callXFlowActions.getDispatcher()
    );

    var res1 = instances.runner.runQ(json2.id, {
      'CounterValue' : 0
    });

    var res2 = instances.runner.runQ(json2.id, {
      'CounterValue' : 1
    });

    return RSVP.all([
      expect(res1).to.eventually.deep.equal({
        'CounterValue' : 1
      }),
      expect(res2).to.eventually.deep.equal({
        'CounterValue' : 2
      })
    ]);

  });

  it('can call another xflow multiple times', function() {
    var instances = getInstances();

    var json1 = loadJson('data/capability_flows/add_1.json');
    var json2 = loadJson('data/capability_flows/xflow-call-xflow-3x.json');

    instances.runner.addFlow(json1);
    instances.runner.addFlow(json2);

    var callXFlowActions = new CallXFlowActions({
      runner: instances.runner
    });

    instances.dispatcher.addDispatcher(
      'callxflow', callXFlowActions.getDispatcher()
    );

    var res1 = instances.runner.runQ(json2.id, {
      'CounterValue' : 0
    });

    var res2 = instances.runner.runQ(json2.id, {
      'CounterValue' : 3
    });

    return RSVP.all([
      expect(res1).to.eventually.deep.equal({
        'CounterValue' : 3
      }),
      expect(res2).to.eventually.deep.equal({
        'CounterValue' : 6
      })
    ]);

  });

});
