import RSVP from 'rsvp';

import ObjectActions from './actions/object_actions';
import FlowActions from './actions/flow_actions';

import FlowUtil from './flow-util';

class XFlowDispatcher {

  constructor() {
    this.capabilities = {
      'object' : '1',
      'flow'   : '1'
    };
  }

  processNode(node, state) {
    switch (node.type) {
    case 'object':
      state = ObjectActions.Dispatch(node, state);
      break;
    case 'flow':
      state = FlowActions.Dispatch(node, state);
      break;
    default:
      throw new Error('No handler for node type ', node.type);
    }
    return state;
  }

  processNodeQ(node, state) {
    const defer = RSVP.defer();

    let promise;
    switch (node.type) {
    case 'object':
      promise = ObjectActions.DispatchQ(node, state);
      break;
    case 'flow':
      promise = FlowActions.DispatchQ(node, state);
      break;
    default:
      defer.reject('No handler for node type ', node.type);
    }

    if (FlowUtil.exists(promise)) {
      promise.then(
        (state) => {
          // console.log('processNodeQ - resolve', res);
          defer.resolve(state);
        },
        (err) => {
          console.error('processNodeQ error ', err);
          defer.reject(err);
        }
      );
    }

    return defer.promise;
  }
}

export default XFlowDispatcher;
