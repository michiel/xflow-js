import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';

chai.use(chaiAsPromised);

import XFlowHelper from '../helper/xflow';

function getXFlow(json, params) {
  return XFlowHelper.getXFlowBasic(json, params);
}

describe('XFlow load bad flow ', function() {

  it('loads a json flow with multiple entries and throws an Error ', function() {
    const data = fs.readFileSync('data/invalid_flows/identical_id_nodes.json', 'utf-8');
    const json = JSON.parse(data);
    expect(function() {
      const res = (getXFlow(json, {}));
      res.start();
    }).to.throw(Error, /XFlowStruct/);
  });

  it('loads a json flow with no entries and throws an Error ', function() {
    const data = fs.readFileSync('data/invalid_flows/bad_structure.json', 'utf-8');
    const json = JSON.parse(data);
    expect(function() {
      const res = (getXFlow(json, {}));
      res.start();
    }).to.throw(Error, /XFlowStruct/);
  });

});

