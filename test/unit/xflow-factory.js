import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';

chai.use(chaiAsPromised);

import XFlow from '../../src/xflow';
import XFlowFactory from '../../src/xflow-factory';

import XFlowDispatcherHelper from '../helper/xflow-dispatcher';

function getXFlowFactory() {
  return new XFlowFactory(XFlowDispatcherHelper.getXFlowDispatcherBasic());
}

describe('XFlowFactory Factory ', function() {

  it('loads a valid json flow', function() {
    const data = fs.readFileSync('data/flows/create_object.json', 'utf-8');
    const json = JSON.parse(data);
    const res = getXFlowFactory().buildFlow(json);
    expect(res).to.be.an.instanceof(XFlow);
  });

  it('throws an error when loading a json flow with unmet capability requirements', function() {
    const data = fs.readFileSync('data/bad_flows/bad_capabilities.json', 'utf-8');
    const json = JSON.parse(data);
    expect(function() {
      getXFlowFactory().buildFlow(json);
    }).to.throw(Error);
  });

});

