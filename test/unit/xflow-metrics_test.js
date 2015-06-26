import chai           from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs             from 'fs';

chai.use(chaiAsPromised);

import XFlowStruct        from '../../lib/xflow-struct';
import XFlowMutableStruct from '../../lib/xflow-mutable-struct';
import XFlowMetrics       from '../../lib/xflow-metrics';

function getJSON(path) {
  var data = fs.readFileSync(path, 'utf-8');
  try {
    JSON.parse(data);
  } catch(e) {
    console.log('The offending file is : ', path);
  }
  return JSON.parse(data);
}

describe('XFlowMetrics ', function() {

  it('aborts on incorrect invocation ', function() {
    var reporter  = new XFlowMetrics();
    expect(function() {
      reporter.report();
    }).to.throw(Error);
  });

  it('accepts classes that inherit from XFlowStruct', function() {
    var json      = getJSON('data/flows/10_steps.json');
    var xf        = new XFlowMutableStruct(json);
    var reporter  = new XFlowMetrics();
    var metrics   = reporter.report(xf);

    expect(metrics.ccc).to.equal(0);
  });

  it('can run 10 steps ', function() {
    var json      = getJSON('data/flows/10_steps.json');
    var xf        = new XFlowStruct(json);
    var reporter  = new XFlowMetrics();
    var metrics   = reporter.report(xf);

    expect(metrics.ccc).to.equal(0);
  });

  it('can handle branches ', function() {
    var json      = getJSON('data/flows/branch_boolean_condition.json');
    var xf        = new XFlowStruct(json);
    var reporter  = new XFlowMetrics();
    var metrics   = reporter.report(xf);

    expect(metrics.ccc).to.equal(1);
  });

});


