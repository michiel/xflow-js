import RSVP          from 'rsvp';

import mixin          from './util/mixin';
import emittableMixin from './mixin/emittable';

import XFlow    from './xflow';
import LangUtil from './util/lang';

const exists = LangUtil.exists;

class XFMap {

  constructor() {
    this.map         = {};
    this.flowIdCount = 0;
  }

  addFlow(flow) {
    if (!(flow instanceof XFlow)) {
      throw new Error('XFMap.addFlow : parameter is not an instance of XFlow');
    }

    const id = this.flowIdCount++;

    this.map[id] = {
      flow  : flow,
      ticks : 0
    };
    return id;
  }

  removeFlow(id) {
    delete this.map[id];
  }

  getFlow(id) {
    if (!(id in this.map)) {
      throw new Error('XFMap.getFlow : No ID in map : ' + id);
    }
    return this.map[id].flow;
  }

  tickFlow(id) {
    return this.map[id].ticks++;
  }

}

function logEmission(...args) {
  console.log('RUNNER LOG EMISSION ', this.event, ...args);
}

/**
 * XFlowRunner - class for scheduling and executing XFlows
 *
 * @class XFlowRunner
 * @event XFlowRunner#addFlow
 * @event XFlowRunner#tickFlow
 * @example
 *         var runner = new XFlowRunner(new XFlowDispatcher());
 */
class XFlowRunner {

  /**
   * XFlowRunner class
   *
   * @class XFlowRunner
   * @constructor XFlowRunner
   * @param {XFlowFactory} fact XFlowFactory
   * @param {Object} opts (optional) Parameter hash
   */
  constructor(fact, opts={}) {

    if (!exists(fact)) {
      throw new Error('XFlowRunner : No valid factory passed');
    }

    this.factory   = fact;
    this.xfmap     = new XFMap();
    this.idCounter = 0;

    this.initEmittable();

    this.tickLimit = opts.tickLimit || 4096;

    this.factory.emitter.onAny(logEmission);
  }

  /**
   * Add a JSON flow with optional parameters for execution
   * @method addFlow
   * @param {Object} flowJson JSON flow
   * @param {Object} params (optional) initial parameters
   * @return {String} Flow identifier
   * @example
   *     var id = runner.addFlow(flowJson, {}); // 1
   */
  addFlow(flowJson, params={}) {
    this.emit('addFlow');
    const flow = this.factory.buildFlow(
      flowJson,
      params,
      this.idCounter++
    );

    const id = this.xfmap.addFlow(flow);
    return id;
  }

  tickFlow(id) {
    this.emit('tickFlow', id);
    const res = this.xfmap.tickFlow(id);
    if (res > this.tickLimit) {
      throw new Error(
        `XFlowRunner : Cycle limit exceeded by ${id} - ${res} ticks, limit is ${this.tickLimit}`
      );
    }
  }

  getFlowEmitter(id) {
    return this.xfmap.getFlow(id).emitter;
  }

  /**
   * Run the specified flow to completion [sync]
   *
   * @method runFlow
   * @param {String} id
   * @return {Array} Return values
   * @example
   *     var res = runner.runFlow(flowJson); // []
   */
  runFlow(id) {
    const flow = this.xfmap.getFlow(id);
    let ret = true;
    while (ret) {
      this.tickFlow(id);
      ret = flow.nextStep();
    }
    this.xfmap.removeFlow(id);
    return flow.returnValue();
  }

  /**
   * Run the specified flow to completion [async]
   *
   * @method runFlowQ
   * @param {String} id
   * @return {Promise} Resolves to Array of return values
   * @example
   *     var res = runner.runFlow(flowJson); // {Promise}
   */
  runFlowQ(id) {
    const flow  = this.xfmap.getFlow(id);
    const defer = RSVP.defer();

    const nextStep = (()=> {
      this.tickFlow(id);
      flow.nextStepQ().then(
        (hasNext)=> {
          if (hasNext) {
            nextStep();
          } else {
            defer.resolve(flow.returnValue());
            this.xfmap.removeFlow(id);
          }
        },
        (err)=> {
          console.error('XFlowRunner.runFlowQ : error ', err);
          defer.reject('XFlowRunner.runFlowQ : error ' + err);
        }
      );
    }).bind(this);

    nextStep();

    return defer.promise;
  }

  /**
   * Run the next step of the specified flow [sync]
   *
   * @method stepFlow
   * @param {String} id
   * @return {Boolean} Value indicating whether there was a next step to execute
   */
  stepFlow(id) {
    this.tickFlow(id);
    const flow = this.xfmap.getFlow(id);

    //
    // XXX: When to call this.xfmap.removeFlow(id); ?
    // Listen to flow emitter end event
    //

    return flow.nextStep();
  }

  /**
   * Run the next step of the specified flow [async]
   *
   * @method stepFlowQ
   * @param {String} id
   * @return {Promise} Resolve to value indicating whether there was a next step to execute
   */
  stepFlowQ(id) {
    this.tickFlow(id);
    const flow = this.xfmap.getFlow(id);

    //
    // XXX: When to call this.xfmap.removeFlow(id); ?
    // Listen to flow emitter end event
    //

    return flow.nextStepQ();
  }

}

mixin(XFlowRunner, emittableMixin);

export default XFlowRunner;

