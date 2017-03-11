import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';

chai.use(chaiAsPromised);

import XFlowStruct from '../../src/xflow-struct';
import XFlowMutableStruct from '../../src/xflow-mutable-struct';
import XFlowMetrics from '../../src/xflow-metrics';

function getJSON(path) {
  const data = fs.readFileSync(path, 'utf-8');
  try {
    JSON.parse(data);
  } catch (e) {
    console.log('The offending file is : ', path);
  }
  return JSON.parse(data);
}

describe('XFlowMetrics ', function() {

  it('aborts on incorrect invocation ', function() {
    const reporter = new XFlowMetrics();
    expect(function() {
      reporter.report();
    }).to.throw(Error);
  });

  it('accepts classes that inherit from XFlowStruct', function() {
    const json = getJSON('data/flows/10_steps.json');
    const xf = new XFlowMutableStruct(json);
    const reporter = new XFlowMetrics();
    const metrics = reporter.report(xf);

    expect(metrics.ccc).to.equal(0);
  });

  it('can run 10 steps ', function() {
    const json = getJSON('data/flows/10_steps.json');
    const xf = new XFlowStruct(json);
    const reporter = new XFlowMetrics();
    const metrics = reporter.report(xf);

    expect(metrics.ccc).to.equal(0);
  });

  it('can handle branches ', function() {
    const json = getJSON('data/flows/branch_boolean_condition.json');
    const xf = new XFlowStruct(json);
    const reporter = new XFlowMetrics();
    const metrics = reporter.report(xf);

    expect(metrics.ccc).to.equal(1);
  });

});

