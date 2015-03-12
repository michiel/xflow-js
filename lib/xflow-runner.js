import RSVP from 'rsvp';
import EventEmitter2 from 'eventemitter2';

const EM = EventEmitter2.EventEmitter2;

import XFlow from './xflow';
import Util  from './flow-util';

const exists = Util.exists;

class XFMap {

  constructor() {
    this.map = {};
  }

  addFlow(flow) {
    if (!(flow instanceof XFlow)) {
      throw new Error('XFMap.addFlow : parameter is not an instance of XFlow');
    }

    this.map[flow.id] = {
      flow  : flow,
      ticks : 0
    };
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
 * @class XFlowRunner
 */
class XFlowRunner {

  /**
   * XFlowRunner constructor
   * @constructor XFlowRunner
   * @param {XFlowFactory} disp
   */
  constructor(fact, opts={}) {

    if (!exists(fact)) {
      throw new Error('XFlowRunner : No valid factory passed');
    }

    this.factory   = fact;
    this.xfmap     = new XFMap();
    this.idCounter = 0;
    this.emitter   = new EM({
      wildcard : true
    });
    this.tickLimit = opts.tickLimit || 4096;

    this.factory.emitter.onAny(logEmission);
  }

  /**
   * Add a JSON flow with optional parameters for execution
   * @method XFlowRunner#addFlow
   * @param {Object} flowJson JSON flow
   * @param {Object} params (optional) initial parameters
   * @return {String} Flow identifier
   */
  addFlow(flowJson, params={}) {
    const flow = this.factory.buildFlow(
      flowJson,
      params,
      this.idCounter++
    );

    this.xfmap.addFlow(flow);
    return flow.id;
  }

  tickFlow(id) {
    const res = this.xfmap.tickFlow(id);
    if (res > this.tickLimit) {
      this.xfmap.removeFlow(id);
      throw new Error(
        `XFlowRunner : Cycle limit exceeded by ${id} - ${res} ticks, limit is ${this.tickLimit}`
      );
    }
  }

  getFlowEmitter(id) {
    return this.xfmap.getFlow(id).emitter;
  }

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

  runFlowQ(id) {
    const flow  = this.xfmap.getFlow(id);
    const defer = RSVP.defer();

    const nextStep = ()=> {
      this.tickFlow(id);
      flow.nextStepQ().then(
        (hasNext)=> {
          if (hasNext) {
            nextStep();
          } else {
            this.xfmap.removeFlow(id);
            defer.resolve(flow.returnValue());
          }
        },
        (err)=> {
          console.error('XFlowRunner.runFlowQ : error ', err);
          defer.reject('XFlowRunner.runFlowQ : error ' + err);
        }
      );
    };

    nextStep();

    return defer.promise;
  }

  stepFlow(id) {
    this.tickFlow(id);
    const flow = this.xfmap.getFlow(id);

    //
    // XXX: When to call this.xfmap.removeFlow(id); ?
    // Listen to flow emitter end event
    //

    return flow.nextStep();
  }

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

export default XFlowRunner;

