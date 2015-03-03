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

describe('XFlow sync ', function() {

    it('loads a json flow with multiple entries and throws an Error ', function() {
        var data = fs.readFileSync('data/bad_flows/multiple_entry_nodes.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {}));
        expect(res.start).to.throw(Error);
      });

  });

describe('XFlow async ', function() {

    it('loads a json flow with multiple entries and rejects the Promise', function() {
        var data = fs.readFileSync('data/bad_flows/multiple_entry_nodes.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (getXFlow(json, {}));
        expect(res.startQ()).to.eventually.throw(Error);
      });

  });

