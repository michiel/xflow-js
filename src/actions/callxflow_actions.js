import RSVP from 'rsvp';

import {
  isObject,
  hasProperty,
  isString,
} from '../util/lang';

const isValidNode = (node)=> {
  return (
    isObject(node) &&
      (node.nodetype === 'callxflow') &&
      hasProperty(node, 'parameters.xflowid') &&
      isString(node.parameters.xflowid)
  );
};

const assertIsValidNode = (node)=> {
  if (!isValidNode(node)) {
    throw new Error(
      `CallXFlowDispatcher.assertIsValidNode : invalid node ${node}`
    );
  }
};

class CallXFlowDispatcher {

  constructor(args = {}) {
    this.version = 1;
    this.name = 'callxflow';
    this.runner = args.runner;
  }

  dispatch(node, state) {
    assertIsValidNode(node);
    // console.log(`${this.name}.dispatch`, JSON.stringify(node));
    return this.runner.run(node.parameters.xflowid, state);
  }

  dispatchQ(node, state) {
    // console.log(`${this.name}.dispatchQ`);
    const defer = RSVP.defer();

    if (!isValidNode(node)) {
      defer.reject(
        `${this.name}.dispatchQ.reject : invalid node`
      );
    } else {
      this.runner.runQ(
        node.parameters.xflowid,
        state
      ).then(
        (res)=> {
          // console.log('resolving with', res);
          return defer.resolve(res);
        },
        (err)=> defer.reject(
          `${this.name}.dispatchQ.reject : ${err}`
        )
      );
    }

    return defer.promise;
  }

  getDispatcher() {
    return {
      version: this.version,
      name: this.name,
      dispatch: this.dispatch.bind(this),
      dispatchQ: this.dispatchQ.bind(this),

    };
  }

}

export default CallXFlowDispatcher;
