import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';

chai.use(chaiAsPromised);

import xFlow from '../../lib/xflow';

describe('xFlow sync ', function() {

    it('loads a json flow', function() {
        var data = fs.readFileSync('data/create_object.json', 'utf-8');
        var json = JSON.parse(data);
        var res = xFlow(json, {}).start();
        expect(res).to.deep.equal([{}]);
      });

    it('runs a flow with an arithmetic expression ', function() {
        var data = fs.readFileSync('data/arithmetic_addition.json', 'utf-8');
        var json = JSON.parse(data);
        var res = xFlow(json, {}).start();

        expect(JSON.stringify(res)).to.equal(
          JSON.stringify([{
            'ReturnValue': 3
          }]));
      });

  });

describe('xFlow async ', function() {

    it('loads a json flow', function() {
        var data = fs.readFileSync('data/create_object.json', 'utf-8');
        var json = JSON.parse(data);
        var res = xFlow(json, {}).startQ();
        expect(res).to.eventually.deep.equal([{}]);
      });

    it('runs a flow with an arithmetic expression ', function() {
        var data = fs.readFileSync('data/arithmetic_addition.json', 'utf-8');
        var json = JSON.parse(data);
        var res = xFlow(json, {}).startQ();
        expect(res).to.eventually.deep.equal([{
            'ReturnValue' : 3
          }]);
      });

  });
