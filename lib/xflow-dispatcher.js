import RSVP          from 'rsvp';

import ObjectActions from './actions/object_actions';
import FlowActions   from './actions/flow_actions';
import LangUtil      from './util/lang';

const exists = LangUtil.exists;

/**
 * Default dispatcher for XFlow event processing
 *
 * @class XFlowDispatcher
 */
class XFlowDispatcher {

  /**
   * XFlowDispatcher class
   *
   * @class XFlowDispatcher
   * @constructor XFlowDispatcher
   */
  constructor() {
    this.capabilities = {
      'object' : 1,
      'flow'   : 1
    };
  }

  /**
   * Process a node with state [sync]
   *
   * @method processNode
   * @param {Object} node The flow node to process
   * @param {Object} state The state in which context to process the node
   * @return {Object} The state after processing
   */
  processNode(node, state) {
    switch (node.nodetype) {
    case 'object':
      state = ObjectActions.Dispatch(node, state);
      break;
    case 'flow':
      state = FlowActions.Dispatch(node, state);
      break;
    default:
      throw new Error('No handler for node.nodetype ', node.nodetype);
    }
    return state;
  }

  /**
   * Process a node with state [async]
   *
   * @method processNodeQ
   * @param {Object} node The flow node to process
   * @param {Object} state The state in which context to process the node
   * @return {Promise} Resolves to the the state after processing
   */
  processNodeQ(node, state) {
    const defer = RSVP.defer();

    let promise;
    switch (node.nodetype) {
    case 'object':
      promise = ObjectActions.DispatchQ(node, state);
      break;
    case 'flow':
      promise = FlowActions.DispatchQ(node, state);
      break;
    default:
      defer.reject('No handler for node.nodetype ', node.nodetype);
    }

    if (exists(promise)) {
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
