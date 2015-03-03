import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';

chai.use(chaiAsPromised);

import XFlowFactory from '../../lib/xflow-factory';
import XFlowDispatcher from '../../lib/xflow-dispatcher';

function getXFlowFactory() {
  return new XFlowFactory(new XFlowDispatcher());
}

describe('XFlowFactory Factory sync ', function() {

  it('loads a json flow', function() {
    var data = fs.readFileSync('data/create_object.json', 'utf-8');
    var json = JSON.parse(data);
    var res = getXFlowFactory().run(json);
    expect(res).to.deep.equal([{}]);
  });

});

describe('XFlow Factory async ', function() {

  it('loads a json flow', function() {
    var data = fs.readFileSync('data/create_object.json', 'utf-8');
    var json = JSON.parse(data);
    var res = getXFlowFactory().runQ(json);
    expect(res).to.eventually.deep.equal([{}]);
  });

});

