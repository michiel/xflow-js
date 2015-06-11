import RSVP from 'rsvp';

import LangUtil from '../util/lang';

const exists = LangUtil.exists;

class CallXFlowDispatcher {

  constructor(xflowstructs=[]) {
    this.version = 1;
    this.name    = 'callxflow';
  }

  dispatch(node, state) {
    return state;
  }

  dispatchQ(node, state) {
    const defer  = RSVP.defer();

    defer.resolve(state);

    return defer;
  }

  getDispatchers() {
    return {
      version   : this.version,
      name      : this.name,
      dispatch  : this.dispatch.bind(this),
      dispatchQ : this.dispatchQ.bind(this)

    };
  }

}

export default CallXFlowDispatcher;
