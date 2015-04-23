import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';

chai.use(chaiAsPromised);

import XFlow from '../../lib/xflow';
import XFlowDispatcher from '../../lib/xflow-dispatcher';

function getXFlow(json, params) {
  var dispatcher = new XFlowDispatcher();
  return new XFlow(json, params, dispatcher);
}

describe('xFlow sync emitter ', function() {

    it('loads a json flow', function() {
        var data = fs.readFileSync('data/flows/branch_boolean.json', 'utf-8');
        var json = JSON.parse(data);
        var flow = getXFlow(json, {});

        flow.emitter.on('start', function() {
          // console.log('Flow start sync event');
        });

        flow.emitter.on('nextStep', function() {
          // console.log('Flow nextStep sync event');
        });

        flow.emitter.on('end', function() {
          // console.log('Flow end sync event');
        });

        var res = flow.start();
        expect(res).to.deep.equal({
          'ReturnValue' : 0
        });
      });

  });

describe('xFlow async event emission', function() {

    it('executes a flow and emits events', function(done) {
        var data = fs.readFileSync('data/flows/branch_boolean.json', 'utf-8');
        var json = JSON.parse(data);
        var flow = getXFlow(json, {});

        flow.emitter.on('start', function() {
          // console.log('Flow start async event');
        });

        flow.emitter.on('nextStep', function() {
          // console.log('Flow nextStep async event');
        });

        flow.emitter.on('end', function() {
          // console.log('Flow end async event');
        });

        var res = flow.startQ();
        expect(res).to.eventually.deep.equal({
          'ReturnValue' : 0
        }).notify(done);
      });

  });

