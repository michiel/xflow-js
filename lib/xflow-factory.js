import EventEmitter2 from 'eventemitter2';
const EM = EventEmitter2.EventEmitter2;

import XFlow from './xflow';

function logEmission(...args) {
  // console.log('LOG EMISSION ', this.event, ...args);
}

class XFlowFactory {

  constructor(disp) {
    this.dispatcher = disp;
    this.emitter    = new EM({
      wildcard : true
    });
  }

  buildFlow(flowData, params) {
    return new XFlow(flowData, params, this.dispatcher);
  }

  run(flowData, params={}) {
    const flow = this.buildFlow(flowData, params);
    flow.emitter.onAny(logEmission);
    return flow.start();
  }

  runQ(flowData, params={}) {
    const flow = this.buildFlow(flowData, params);
    flow.emitter.onAny(logEmission);
    return flow.startQ();
  }

}

export default XFlowFactory;
