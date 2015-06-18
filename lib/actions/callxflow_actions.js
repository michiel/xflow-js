import RSVP from 'rsvp';

import LangUtil from '../util/lang';

const exists = LangUtil.exists;

class CallXFlowDispatcher {

  constructor(args={}) {
    this.version = 1;
    this.name    = 'callxflow';
    this.runner  = args.runner;
  }

  dispatch(node, state) {
    // console.log(`${this.name}.dispatch`, JSON.stringify(node));
    return this.runner.run(node.parameters.xflowid, state);
  }

  dispatchQ(node, state) {
    console.log(`${this.name}.dispatchQ`);
    const defer  = RSVP.defer();

    defer.resolve(state);

    return defer;
  }

  getDispatcher() {
    return {
      version   : this.version,
      name      : this.name,
      dispatch  : this.dispatch.bind(this),
      dispatchQ : this.dispatchQ.bind(this)

    };
  }

}

export default CallXFlowDispatcher;
