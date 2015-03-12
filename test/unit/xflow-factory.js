import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';

chai.use(chaiAsPromised);

import XFlow           from '../../lib/xflow';
import XFlowFactory    from '../../lib/xflow-factory';
import XFlowDispatcher from '../../lib/xflow-dispatcher';

function getXFlowFactory() {
  return new XFlowFactory(new XFlowDispatcher());
}

describe('XFlowFactory Factory ', function() {

  it('loads a valid json flow', function() {
    var data = fs.readFileSync('data/create_object.json', 'utf-8');
    var json = JSON.parse(data);
    var res = getXFlowFactory().buildFlow(json);
    expect(res).to.be.an.instanceof(XFlow);
  });

  it('throws an error when loading a json flow with bad capabilities', function() {
    var data = fs.readFileSync('data/bad_flows/bad_capabilities.json', 'utf-8');
    var json = JSON.parse(data);
    expect(function() {
      getXFlowFactory().buildFlow(json);
    }).to.throw(Error);
  });

});

