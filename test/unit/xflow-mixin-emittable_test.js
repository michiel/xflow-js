import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
import RSVP from 'rsvp';

chai.use(chaiAsPromised);

import XFlowHelper from '../helper/xflow';

function getXFlow(json, params) {
  return XFlowHelper.getXFlowBasic(json, params);
}

describe('xFlow sync emitter ', function() {

  it('loads a json flow', function() {
    const data = fs.readFileSync('data/flows/branch_boolean.json', 'utf-8');
    const json = JSON.parse(data);
    const flow = getXFlow(json, {});

    const defer1 = RSVP.defer();
    const defer2 = RSVP.defer();
    const defer3 = RSVP.defer();

    flow.emitter.on('start', function() {
          // console.log('Flow start sync event');
      defer1.resolve();
    });

    flow.emitter.on('nextStep', function() {
          // console.log('Flow nextStep sync event');
      defer2.resolve();
    });

    flow.emitter.on('end', function() {
          // console.log('Flow end sync event');
      defer3.resolve();
    });

    const res = flow.start();
    expect(res).to.deep.equal({
      'ReturnValue': 0,
    });

    return RSVP.all([
      defer1,
      defer2,
      defer3,
    ]);
  });

});

describe('xFlow async event emission', function() {

  it('executes a flow and emits events', function() {
    const data = fs.readFileSync('data/flows/branch_boolean.json', 'utf-8');
    const json = JSON.parse(data);
    const flow = getXFlow(json, {});

    const defer1 = RSVP.defer();
    const defer2 = RSVP.defer();
    const defer3 = RSVP.defer();
    const defer4 = RSVP.defer();

    flow.emitter.on('start', function() {
          // console.log('Flow start async event');
      defer1.resolve();
    });

    flow.emitter.on('nextStep', function() {
          // console.log('Flow nextStep async event');
      defer2.resolve();
    });

    flow.emitter.on('end', function() {
          // console.log('Flow end async event');
      defer3.resolve();
    });

    flow.startQ().then(
          function(res) {
            expect(res).to.deep.equal({
              'ReturnValue': 0,
            });
            defer4.resolve();
          });

    return RSVP.all([
      defer1,
      defer2,
      defer3,
      defer4,
    ]);
  });

});

