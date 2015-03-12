import RSVP from 'rsvp';
import EventEmitter2 from 'eventemitter2';

const EM = EventEmitter2.EventEmitter2;

import XFlow from './xflow';

class XFMap {

  constructor() {
    this.map = {};
  }

  addFlow(flow) {
    if (!(flow instanceof XFlow)) {
      throw new Error('XFMap.addFlow : parameter is not an instance of XFlow');
    }

    this.map[flow.id] = {
      flow  : flow
    };
  }

  getFlow(id) {
    if (!(id in this.map)) {
      throw new Error('XFMap.getFlow : No ID in map : ' + id);
    }
    return this.map[id].flow;
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
  constructor(fact) {

    if (!!!fact) {
      throw new Error('XFlowRunner : No valid factory passed');
    }

    this.factory   = fact;
    this.xfmap     = new XFMap();
    this.idCounter = 0;
    this.emitter   = new EM({
      wildcard : true
    });
    this.factory.emitter.onAny(logEmission);
  }

  /**
   * Add a JSON flow with optional parameters for execution
   * @method XFlowRunner#addFlow
   * @param {Object} flowJson JSON flow
   * @param {Object} params (optional) initial parameters
   * @returns {String} Flow identifier
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

  getFlowEmitter(id) {
    return this.xfmap.getFlow(id).emitter;
  }

  runFlow(id) {
    const flow = this.xfmap.getFlow(id);
    let ret = true;
    while (ret) {
      ret = flow.nextStep();
    }
    return flow.returnValue();
  }

  runFlowQ(id) {
    const flow  = this.xfmap.getFlow(id);
    const defer = RSVP.defer();

    const nextStep = ()=> {
      flow.nextStepQ().then(
        (hasNext)=> {
          if (hasNext) {
            nextStep();
          } else {
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
    const flow = this.xfmap.getFlow(id);
    return flow.nextStep();
  }

  stepFlowQ(id) {
    const flow = this.xfmap.getFlow(id);
    return flow.nextStepQ();
  }

}

export default XFlowRunner;

