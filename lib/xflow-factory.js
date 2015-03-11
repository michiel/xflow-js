import EventEmitter2 from 'eventemitter2';
const EM = EventEmitter2.EventEmitter2;

import XFlow from './xflow';

function logEmission(...args) {
  // console.log('FACTORY LOG EMISSION ', this.event, ...args);
}

class XFlowFactory {

  constructor(disp) {
    this.dispatcher = disp;
    this.emitter    = new EM({
      wildcard : true
    });
  }

  buildFlow(flowData, params) {
    this.checkCapabilities(flowData);
    return new XFlow(flowData, params, this.dispatcher);
  }

  checkCapabilities(flow) {
    const caps = this.dispatcher.capabilities;
    const unmatchedCaps = flow.capabilities.filter(
      (cap) => {
        return (
          (cap.type in caps) &&
          cap.version === caps[cap.type]
        );
      }
    );

    if (unmatchedCaps.length !== 0) {
      throw new Error('XFlowFactory : Unmatched requirements! ' + unmatchedCaps);
    }

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
