import chai           from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs             from 'fs';
import RSVP           from 'rsvp';

chai.use(chaiAsPromised);

import XFlowMutableStruct  from '../../lib/xflow-mutable-struct';

function getJSON(path) {
  var data = fs.readFileSync(path, 'utf-8');

  try {
    JSON.parse(data);
  } catch(e) {
    console.log('Cannot parse JSON - The offending file is : ', path);
    throw new Error('Cannot parse JSON - The offending file is : ' + path);
  }

  return JSON.parse(data);
}

describe('XFlowMutableStruct emissions', function() {

  it('can emit events', function() {
    var json      = getJSON('data/flows/10_steps.json');
    var xf        = new XFlowMutableStruct(json);
    var defer     = RSVP.defer();

    xf.on('change', function(event, deltas) {
      expect(deltas[0].op).to.equal('add');
      expect(deltas[0].path).to.equal('/nodes/10');
      defer.resolve();
    });

    var node = xf.newNode();
    xf.addNode(node);

    return defer.promise;

  });

});
