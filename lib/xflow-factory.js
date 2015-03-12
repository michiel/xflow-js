import EventEmitter2 from 'eventemitter2';
const EM = EventEmitter2.EventEmitter2;

import XFlow from './xflow';

function logEmission(...args) {
  // console.log('FACTORY LOG EMISSION ', this.event, ...args);
}

/**
 * XFlowFactory - instantiates new executable flows with a dispatcher
 * @class XFlowFactory
 */
class XFlowFactory {

  /**
   * XFlowFactory constructor
   * @constructor XFlowFactory
   * @param {XFlowDispatcher} disp
   */
  constructor(disp) {
    this.dispatcher = disp;
    this.emitter    = new EM({
      wildcard : true
    });
  }

  /**
   * Supply a valid JSON flow and it returns an XFlow with dispatcher
   * @method XFlowFactory#buildFlow
   * @param {Object} flowData JSON flow
   * @param {Object} params (optional) parameter hash
   */
  buildFlow(flowData, params) {
    this.checkCapabilities(flowData);
    return new XFlow(flowData, params, this.dispatcher);
  }

  checkCapabilities(flow) {
    const caps          = this.dispatcher.capabilities;
    const unmatchedCaps = flow.capabilities.filter(
      (cap) => {
        return !(
          (cap.type in caps) &&
          cap.version === caps[cap.type]
        );
      }
    );

    if (unmatchedCaps.length !== 0) {
      const capNames = unmatchedCaps.map(
        (cap)=> `${cap.type}:${cap.version}`
      ).join(' / ');
      throw new Error(
        `XFlowFactory : Unmatched capability requirements ${capNames} in flow ${flow.name}`
      );
    }

  }

}

export default XFlowFactory;
