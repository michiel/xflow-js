import RSVP from 'rsvp';

import LangUtil from '../util/lang';

function isValidNode(node) {
  return (
    LangUtil.isObject(node) &&
      (node.nodetype === 'callxflow') &&
      LangUtil.hasProperty(node, 'parameters.xflowid') &&
      LangUtil.isString(node.parameters.xflowid)
  );
}

function assertIsValidNode(node) {
  if (!isValidNode(node)) {
    throw new Error(
      `CallXFlowDispatcher.assertIsValidNode : invalid node ${node}`
    );
  }
}

class CallXFlowDispatcher {

  constructor(args={}) {
    this.version = 1;
    this.name    = 'callxflow';
    this.runner  = args.runner;
  }

  dispatch(node, state) {
    assertIsValidNode(node);
    // console.log(`${this.name}.dispatch`, JSON.stringify(node));
    return this.runner.run(node.parameters.xflowid, state);
  }

  dispatchQ(node, state) {
    // console.log(`${this.name}.dispatchQ`);
    const defer  = RSVP.defer();

    if (!isValidNode(node)) {
      defer.reject('CallXFlowDispatcher : Invalid node');
    } else {
      this.runner.runQ(
        node.parameters.xflowid,
        state
      ).then(
        (res)=> defer.resolve(state),
        (err)=> defer.reject(`${this.name}.dispatchQ.reject : ${err}`)
      );
    }

    return defer.promise;
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
