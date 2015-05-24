import chai           from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs             from 'fs';

chai.use(chaiAsPromised);

import XFlow           from '../../lib/xflow';
import XFlowDispatcher from '../../lib/xflow-dispatcher';

function getXFlow(json, params) {
  var dispatcher = new XFlowDispatcher();
  return new XFlow(json, params, dispatcher);
}

describe('XFlow load bad flow ', function() {

    it('loads a json flow with multiple entries and throws an Error ', function() {
        var data = fs.readFileSync('data/invalid_flows/identical_id_nodes.json', 'utf-8');
        var json = JSON.parse(data);
        expect(function() {
          var res = (getXFlow(json, {}));
          res.start();
        }).to.throw(Error, /XFlowStruct/);
      });

    it('loads a json flow with no entries and throws an Error ', function() {
        var data = fs.readFileSync('data/invalid_flows/bad_structure.json', 'utf-8');
        var json = JSON.parse(data);
        expect(function() {
          var res = (getXFlow(json, {}));
          res.start();
        }).to.throw(Error, /XFlowStruct/);
      });

  });

