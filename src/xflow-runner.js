import RSVP from 'rsvp';

import XFlowHarness from './xflow-harness';
import DocRegistry from './helper/docregistry';

class XFlowRunner {

  constructor(opts) {
    this.name = 'XFlowRunner';
    this.xfmap = new DocRegistry();
    this.factory = opts.factory;
    this.tickLimit = opts.tickLimit || 4096;
  }

  _makeHarness(xflow) {
    return new XFlowHarness(xflow, {
      tickLimit: this.tickLimit,
    });
  }

  run(xflowId, state) {
    if (!this.xfmap.has(xflowId)) {
      throw new Error(
        `${this.name}.run : No xflow with ID '${xflowId} found in registry`
      );
    }

    const xflow = this.factory.buildFlow(
      this.xfmap.get(xflowId),
      state
    );

    const harness = this._makeHarness(xflow);

    return harness.runFlow();
  }

  runQ(xflowId, state) {
    const defer = RSVP.defer();

    if (!this.xfmap.has(xflowId)) {
      defer.reject(
        `${this.name}.run : No xflow with ID '${xflowId} found in registry`
      );
    }

    const xflow = this.factory.buildFlow(
      this.xfmap.get(xflowId),
      state
    );

    const harness = this._makeHarness(xflow);

    harness.runFlowQ().then(
      (res)=> {
        // console.log('qrunner.harness.resolve ', res);
        defer.resolve(res);
        return res;
      },
      (err)=> defer.reject(err)
    );

    return defer.promise;
  }

  addFlow(flowJson) {
    this.xfmap.add(flowJson);
  }

  removeFlow(id) {
    this.xfmap.remove(id);
  }

  hasFlow(id) {
    return this.xfmap.has(id);
  }

}

export default XFlowRunner;

