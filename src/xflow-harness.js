import RSVP from 'rsvp';

import mixin from './util/mixin';
import emittableMixin from './mixin/emittable';

/**
 * XFlowHarness - class for scheduling and executing XFlows
 *
 * @class XFlowHarness
 * @event XFlowHarness#addFlow
 * @event XFlowHarness#tickFlow
 * @example
 *         var runner = new XFlowHarness(new XFlow());
 */
class XFlowHarness {

  /**
   * XFlowHarness class
   *
   * @class XFlowHarness
   * @constructor XFlowHarness
   * @param {XFlow} xflow
   * @param {Object} opts (optional) Parameter hash
   */
  constructor(xflow, opts = {}) {
    this.xflow = xflow;
    this.ticks = 0;
    this.tickLimit = opts.tickLimit || 4096;

    this.initEmittable();
  }

  tickFlow() {
    const id = this.xflow.id;
    this.emit('tickFlow', id);
    this.ticks = this.ticks + 1;
    if (this.ticks > this.tickLimit) {
      throw new Error(
        `${this.name} : limit exceeded by ${id}/${this.ticks} ticks, limit is ${this.tickLimit}`
      );
    }
  }

  /**
   * Run the flow to completion [sync]
   *
   * @method runFlow
   * @return {Array} Return values
   * @example
   *     var res = runner.runFlow(flowJson); // []
   */
  runFlow() {
    const flow = this.xflow;

    let ret = true;
    while (ret) {
      this.tickFlow();
      ret = flow.nextStep();
    }
    return flow.returnValue();
  }

  /**
   * Run the flow to completion [async]
   *
   * @method runFlowQ
   * @return {Promise} Resolves to Array of return values
   * @example
   *     var res = runner.runFlow(flowJson); // {Promise}
   */
  runFlowQ() {
    const flow = this.xflow;
    const defer = RSVP.defer();

    const nextStep = (()=> {
      this.tickFlow();
      flow.nextStepQ().then(
        (hasNext)=> {
          if (hasNext) {
            nextStep();
          } else {
            defer.resolve(flow.returnValue());
          }
        },
        (err)=> {
          console.error('XFlowHarness.runFlowQ : error ', err);
          defer.reject('XFlowHarness.runFlowQ : error ' + err);
        }
      );
    });

    nextStep();

    return defer.promise;
  }

  /**
   * Run the next step of the flow [sync]
   *
   * @method stepFlow
   * @return {Boolean} Value indicating whether there was a next step to execute
   */
  stepFlow() {
    this.tickFlow();
    return this.xflow.nextStep();
  }

  /**
   * Run the next step of the flow [async]
   *
   * @method stepFlowQ
   * @return {Promise} Resolve to value indicating whether there was a next step to execute
   */
  stepFlowQ() {
    this.tickFlow();
    return this.xflow.nextStepQ();
  }

}

mixin(XFlowHarness, emittableMixin);

export default XFlowHarness;

