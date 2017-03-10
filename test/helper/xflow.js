import XFlow from '../../src/xflow';

import XFlowDispatcherHelper from './xflow-dispatcher';

function getXFlowBasic(json, params) {
  var dispatcher = XFlowDispatcherHelper.getXFlowDispatcherBasic();
  return new XFlow(json, params, dispatcher);
}

export default {
  getXFlowBasic   : getXFlowBasic
};

