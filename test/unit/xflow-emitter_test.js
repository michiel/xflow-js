import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';

chai.use(chaiAsPromised);

import xFlow from '../../lib/xflow';

describe('xFlow sync emitter ', function() {

    it('loads a json flow', function() {
        var data = fs.readFileSync('data/branch_boolean.json', 'utf-8');
        var json = JSON.parse(data);
        var flow = new xFlow(json, {});

        flow.emitter.on('start', function() {
          console.log('Flow start sync event');
        });

        flow.emitter.on('nextStep', function() {
          console.log('Flow nextStep sync event');
        });

        flow.emitter.on('end', function() {
          console.log('Flow end sync event');
        });

        var res = flow.start();
        expect(res).to.deep.equal([{}]);
      });

  });

describe('xFlow async event emission', function() {

    it('executes a flow and emits events', function() {
        var data = fs.readFileSync('data/branch_boolean.json', 'utf-8');
        var json = JSON.parse(data);
        var flow = new xFlow(json, {});

        flow.emitter.on('start', function() {
          console.log('Flow start async event');
        });

        flow.emitter.on('nextStep', function() {
          console.log('Flow nextStep async event');
        });

        flow.emitter.on('end', function() {
          console.log('Flow end async event');
        });

        var res = flow.startQ();
        expect(res).to.eventually.deep.equal([{}]);
      });

  });
