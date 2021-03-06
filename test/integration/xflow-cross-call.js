import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
import RSVP from 'rsvp';

chai.use(chaiAsPromised);

import XFlowFactory from '../../src/xflow-factory';
import XFlowRunner from '../../src/xflow-runner';
import XFlowDispatcher from '../../src/xflow-dispatcher';

import FlowActions from '../../src/actions/flow_actions';
import FloxActions from '../../src/actions/flox_actions';
import ObjectActions from '../../src/actions/object_actions';

import CallXFlowActions from '../../src/actions/callxflow_actions';

const stdDispatcherDefs = {
  'flox': {
    'name': 'flox',
    'version': 1,
    'dispatch': FloxActions.Dispatch,
    'dispatchQ': FloxActions.DispatchQ,
  },
  'object': {
    'name': 'object',
    'version': 1,
    'dispatch': ObjectActions.Dispatch,
    'dispatchQ': ObjectActions.DispatchQ,
  },
  'flow': {
    'name': 'flow',
    'version': 1,
    'dispatch': FlowActions.Dispatch,
    'dispatchQ': FlowActions.DispatchQ,
  },
};

const getInstances = ()=> {
  const dispatcher = new XFlowDispatcher();
  const factory = new XFlowFactory(dispatcher);
  const runner = new XFlowRunner({
    factory: factory,
  });

  dispatcher.addDispatchers(stdDispatcherDefs);

  return {
    runner: runner,
    factory: factory,
    dispatcher: dispatcher,
  };
}

const loadJson = (path)=> {
  const data = fs.readFileSync(path, 'utf-8');
  return JSON.parse(data);
}

describe('Cross-flow, basic dynamic dispatch invocations [sync]', ()=> {

  it('can call an xflow I', ()=> {
    const json = loadJson('data/flows/create_object.json');
    const instances = getInstances();

    instances.runner.addFlow(json);

    const res = instances.runner.run(json.id, {
      'ReturnValue': true,
    });

    expect(res).to.deep.equal({
      'ReturnValue': true,
    });
  });

  it('can call an xflow II', ()=> {
    const json = loadJson('data/flows/loop_5x.json');
    const instances = getInstances();

    instances.runner.addFlow(json);

    const res = instances.runner.run(json.id, {
      'CounterValue': 0,
    });

    expect(res).to.deep.equal({
      'CounterValue': 6,
    });
  });

  it('can call an xflow III', ()=> {
    const json = loadJson('data/flows/branch_boolean_condition.json');
    const instances = getInstances();

    instances.runner.addFlow(json);

    const res = instances.runner.run(json.id, {
      'CalcValueA': 1,
      'CalcValueB': 2,
    });

    expect(res).to.deep.equal({
      'ReturnValue': true,
    });
  });

});

describe('Cross-flow, basic dynamic dispatch invocations [async]', ()=> {

  it('can call an xflow I', ()=> {
    const json = loadJson('data/flows/create_object.json');
    const instances = getInstances();

    instances.runner.addFlow(json);

    const res = instances.runner.runQ(json.id, {
      'ReturnValue': true,
    });

    return expect(res).to.eventually.deep.equal({
      'ReturnValue': true,
    });
  });

  it('can call an xflow II', ()=> {
    const json = loadJson('data/flows/loop_5x.json');
    const instances = getInstances();

    instances.runner.addFlow(json);

    const res = instances.runner.runQ(json.id, {
      'CounterValue': 0,
    });

    return expect(res).to.eventually.deep.equal({
      'CounterValue': 6,
    });
  });

  it('can call an xflow III', ()=> {
    const json = loadJson('data/flows/branch_boolean_condition.json');
    const instances = getInstances();

    instances.runner.addFlow(json);

    const res = instances.runner.runQ(json.id, {
      'CalcValueA': 1,
      'CalcValueB': 2,
    });

    return expect(res).to.eventually.deep.equal({
      'ReturnValue': true,
    });
  });

});

describe('Cross-flow, call other xflow [sync]', ()=> {

  it('can call another xflow', ()=> {
    const instances = getInstances();

    const json1 = loadJson('data/capability_flows/add_1.json');
    const json2 = loadJson('data/capability_flows/xflow-call-xflow.json');

    instances.runner.addFlow(json1);
    instances.runner.addFlow(json2);

    const callXFlowActions = new CallXFlowActions({
      runner: instances.runner,
    });

    instances.dispatcher.addDispatcher(
      'callxflow', callXFlowActions.getDispatcher()
    );

    let res;

    res = instances.runner.run(json2.id, {
    });

    expect(res).to.deep.equal({
      'CounterValue': 1,
    });

    res = instances.runner.run(json2.id, {
      'CounterValue': 1,
    });

    expect(res).to.deep.equal({
      'CounterValue': 2,
    });

  });

  it('can call another xflow multiple times', ()=> {
    const instances = getInstances();

    const json1 = loadJson('data/capability_flows/add_1.json');
    const json2 = loadJson('data/capability_flows/xflow-call-xflow-3x.json');

    instances.runner.addFlow(json1);
    instances.runner.addFlow(json2);

    const callXFlowActions = new CallXFlowActions({
      runner: instances.runner,
    });

    instances.dispatcher.addDispatcher(
      'callxflow', callXFlowActions.getDispatcher()
    );

    let res;

    res = instances.runner.run(json2.id, {
    });

    expect(res).to.deep.equal({
      'CounterValue': 3,
    });

    res = instances.runner.run(json2.id, {
      'CounterValue': 3,
    });

    expect(res).to.deep.equal({
      'CounterValue': 6,
    });

  });

  it('can call an xflow that calls an xflow multiple times', ()=> {
    const instances = getInstances();

    const json1 = loadJson('data/capability_flows/add_1.json');
    const json2 = loadJson('data/capability_flows/xflow-call-xflow.json');
    const json3 = loadJson('data/capability_flows/xflow-call-xflow-3x.json');
    const json4 = loadJson('data/capability_flows/xflow-call-xflow-indirect.json');

    instances.runner.addFlow(json1);
    instances.runner.addFlow(json2);
    instances.runner.addFlow(json3);
    instances.runner.addFlow(json4);

    const callXFlowActions = new CallXFlowActions({
      runner: instances.runner,
    });

    instances.dispatcher.addDispatcher(
      'callxflow', callXFlowActions.getDispatcher()
    );

    const res1 = instances.runner.run(json4.id, {
      'CounterValue': 0,
    });

    const res2 = instances.runner.run(json4.id, {
      'CounterValue': 3,
    });

    expect(res1).to.deep.equal({
      'CounterValue': 9,
    });

    expect(res2).to.deep.equal({
      'CounterValue': 12,
    });

  });

});

describe('Cross-flow, call other xflow [async]', ()=> {

  it('can call another xflow', ()=> {
    const instances = getInstances();

    const json1 = loadJson('data/capability_flows/add_1.json');
    const json2 = loadJson('data/capability_flows/xflow-call-xflow.json');

    instances.runner.addFlow(json1);
    instances.runner.addFlow(json2);

    const callXFlowActions = new CallXFlowActions({
      runner: instances.runner,
    });

    instances.dispatcher.addDispatcher(
      'callxflow', callXFlowActions.getDispatcher()
    );

    const res1 = instances.runner.runQ(json2.id, {
      'CounterValue': 0,
    });

    const res2 = instances.runner.runQ(json2.id, {
      'CounterValue': 1,
    });

    return RSVP.all([
      expect(res1).to.eventually.deep.equal({
        'CounterValue': 1,
      }),
      expect(res2).to.eventually.deep.equal({
        'CounterValue': 2,
      }),
    ]);

  });

  it('can call another xflow multiple times', ()=> {
    const instances = getInstances();

    const json1 = loadJson('data/capability_flows/add_1.json');
    const json2 = loadJson('data/capability_flows/xflow-call-xflow-3x.json');

    instances.runner.addFlow(json1);
    instances.runner.addFlow(json2);

    const callXFlowActions = new CallXFlowActions({
      runner: instances.runner,
    });

    instances.dispatcher.addDispatcher(
      'callxflow', callXFlowActions.getDispatcher()
    );

    const res1 = instances.runner.runQ(json2.id, {
      'CounterValue': 0,
    });

    const res2 = instances.runner.runQ(json2.id, {
      'CounterValue': 3,
    });

    return RSVP.all([
      expect(res1).to.eventually.deep.equal({
        'CounterValue': 3,
      }),
      expect(res2).to.eventually.deep.equal({
        'CounterValue': 6,
      }),
    ]);

  });

  it('can call an xflow that calls an xflow multiple times', ()=> {
    const instances = getInstances();

    const json1 = loadJson('data/capability_flows/add_1.json');
    const json2 = loadJson('data/capability_flows/xflow-call-xflow.json');
    const json3 = loadJson('data/capability_flows/xflow-call-xflow-3x.json');
    const json4 = loadJson('data/capability_flows/xflow-call-xflow-indirect.json');

    instances.runner.addFlow(json1);
    instances.runner.addFlow(json2);
    instances.runner.addFlow(json3);
    instances.runner.addFlow(json4);

    const callXFlowActions = new CallXFlowActions({
      runner: instances.runner,
    });

    instances.dispatcher.addDispatcher(
      'callxflow', callXFlowActions.getDispatcher()
    );

    const res1 = instances.runner.runQ(json4.id, {
      'CounterValue': 0,
    });

    const res2 = instances.runner.runQ(json4.id, {
      'CounterValue': 3,
    });

    return RSVP.all([
      expect(res1).to.eventually.deep.equal({
        'CounterValue': 9,
      }),
      expect(res2).to.eventually.deep.equal({
        'CounterValue': 12,
      }),
    ]);

  });

});
