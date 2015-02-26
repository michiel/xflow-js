import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';

chai.use(chaiAsPromised);

import xFlow from '../../lib/xflow';

describe('xFlow sync ', function() {

    it('loads a json flow with multiple entries and throws an Error ', function() {
        var data = fs.readFileSync('data/bad_flows/multiple_entry_nodes.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (new xFlow(json, {}));
        expect(res.start).to.throw(Error);
      });

  });

describe('xFlow async ', function() {

    it('loads a json flow with multiple entries and rejects the Promise', function() {
        var data = fs.readFileSync('data/bad_flows/multiple_entry_nodes.json', 'utf-8');
        var json = JSON.parse(data);
        var res = (new xFlow(json, {}));
        expect(res.startQ()).to.eventually.throw(Error);
      });

  });

