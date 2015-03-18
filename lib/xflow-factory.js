import EventEmitter2 from 'eventemitter2';

const EM = EventEmitter2.EventEmitter2;

import XFlow          from './xflow';
import XFlowValidator from './xflow-validator';

function logEmission(...args) {
  // console.log('FACTORY LOG EMISSION ', this.event, ...args);
}

/**
 * XFlowFactory - instantiates new executable flows with a dispatcher
 * @class XFlowFactory
 */
class XFlowFactory {

  /**
   * XFlowFactory
   *
   * @class XFlowFactory
   * @constructor XFlowFactory
   * @param {XFlowDispatcher} disp
   */
  constructor(disp) {
    this.dispatcher     = disp;
    this.xflowvalidator = new XFlowValidator();
    this.emitter        = new EM({
      wildcard : true
    });
  }

  /**
   * Supply a valid JSON flow and it returns an XFlow with dispatcher
   * @method buildFlow
   * @param {Object} flowData JSON flow
   * @param {Object} params (optional) parameter hash
   */
  buildFlow(flowData, params) {
    this.xflowvalidator.validate(flowData);
    this.checkCapabilities(flowData);
    return new XFlow(flowData, params, this.dispatcher);
  }

  checkCapabilities(flow) {
    const caps          = this.dispatcher.capabilities;
    const unmatchedReqs = flow.requirements.filter(
      (req) => {
        return !(
          (req.xtype in caps) &&
          req.version === caps[req.xtype]
        );
      }
    );

    if (unmatchedReqs.length !== 0) {
      const reqNames = unmatchedReqs.map(
        (req)=> `${req.xtype}:${req.version}`
      ).join(' / ');
      throw new Error(
        `XFlowFactory : Unmatched capability requirements ${reqNames} in flow ${flow.name}`
      );
    }

  }

}

export default XFlowFactory;
