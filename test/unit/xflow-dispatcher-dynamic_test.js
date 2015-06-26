import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';

chai.use(chaiAsPromised);

import XFlow           from '../../lib/xflow';
import XFlowDispatcher from '../../lib/xflow-dispatcher';

import XFlowDispatcherHelper  from '../helper/xflow-dispatcher';

function getXFlow(json, params) {
  var dispatcher = XFlowDispatcherHelper.getXFlowDispatcherBasic();
  return new XFlow(json, params, dispatcher);
}

describe('XFlowDispatcher [sync]', function() {

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

describe('XFlowDispatcher [async]', function() {

  it('loads and executes a flow', function() {
    var data = fs.readFileSync('data/flows/create_object.json', 'utf-8');
    var json = JSON.parse(data);
    var res  = getXFlow(json, {
      'ReturnValue' : true
    }).startQ();
    expect(res).to.eventually.deep.equal({
      'ReturnValue' : true
    });
  });

  it('runs a flow with a boolean expression followed by a branch', function() {
    var data = fs.readFileSync('data/flows/branch_boolean_condition.json', 'utf-8');
    var json = JSON.parse(data);
    var res  = (getXFlow(json, {
      'CalcValueA' : 1,
      'CalcValueB' : 2
    })).startQ();
    expect(res).to.eventually.deep.equal({
      'ReturnValue' : true
    });
  });

});


describe('XFlowDispatcher invalid dispatchers', function() {

  it('should error on invalid dispatchers', function() {
    var dispatcher;

    dispatcher = new XFlowDispatcher({});
    expect(function() {
      dispatcher.addDispatcher(null);
    }).to.throw(Error);

    dispatcher = new XFlowDispatcher({});
    expect(function() {
      dispatcher.addDispatcher('test', null);
    }).to.throw(Error);

    dispatcher = new XFlowDispatcher({});
    expect(function() {
      dispatcher.addDispatcher('test', {
      });
    }).to.throw(Error);

    dispatcher = new XFlowDispatcher({});
    expect(function() {
      dispatcher.addDispatcher('test', {
        dispatch : function() {}
      });
    }).to.throw(Error);

    dispatcher = new XFlowDispatcher({});
    expect(function() {
      dispatcher.addDispatcher('test', {
        dispatchQ : function() {},
        dispatch  : function() {}
      });
    }).to.throw(Error);

    dispatcher = new XFlowDispatcher({});
    expect(function() {
      dispatcher.addDispatcher('test', {
        version   : 1,
        dispatchQ : function() {},
        dispatch  : function() {}
      });
    }).to.not.throw(Error);

    dispatcher = new XFlowDispatcher({});
    expect(function() {
      dispatcher.addDispatcher('test', {
        version   : 1,
        dispatchQ : function() {},
        dispatch  : function() {}
      });
      dispatcher.addDispatcher('test', {
        version   : 1,
        dispatchQ : function() {},
        dispatch  : function() {}
      });
    }).to.throw(Error);

  });
});


describe('XFlowDispatcher request for unavailable dispatcher', function() {

  it('should error on unavailable dispatchers', function() {
    var dispatcher;

    dispatcher = new XFlowDispatcher({});

    expect(function() {
      dispatcher.processNode({
        nodetype   : 'unavailable',
        parameters : {}
      }, {});
    }).to.throw(Error);

    expect(function() {
      dispatcher.processNodeQ({
        nodetype   : 'unavailable',
        parameters : {}
      }, {});
    }).to.throw(Error);

  });

});
