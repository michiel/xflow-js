import LangUtil from './util/lang';

const exists           = LangUtil.exists;

function assertValidDispatchers(dispatchers) {
  for (let key in dispatchers) {
    if (!LangUtil.isFunction(
      dispatchers[key].dispatch
    )) {
      throw new Error(
        `assertValidDispatchers : Dispatcher ${key} does not implement 'dispatch' method`
      );
    }
    if (!LangUtil.isFunction(
      dispatchers[key].dispatchQ
    )) {
      throw new Error(
        `assertValidDispatchers : Dispatcher ${key} does not implement 'dispatchQ' method`
      );
    }
    if (!LangUtil.isNumber(
      dispatchers[key].version
    )) {
      throw new Error(
        `assertValidDispatchers : Dispatcher ${key} does not have a version method`
      );
    }
  }
}

function buildCapabilities(dispatchers) {
  let ret = {};
  for (let key in dispatchers) {
    ret[key] = dispatchers[key].version;
  }
  return ret;
}

/**
 * Default dispatcher for XFlow event processing
 *
 * @class XFlowDispatcherDynamic
 */
class XFlowDispatcherDynamic {

  /**
   * XFlowDispatcherDynamic class
   *
   * @class XFlowDispatcherDynamic
   * @constructor XFlowDispatcherDynamic
   * @param {Object} dispatchers
   * @throws {Error} On invalid dispatchers
   */
  constructor(dispatchers={}) {
    assertValidDispatchers(dispatchers);
    this.capabilities = buildCapabilities(dispatchers);
    this.dispatchers  = dispatchers;
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
    if (!exists(this.dispatchers[node.nodetype])) {
      throw new Error(
        `XFlowDispatcherDynamic : no dispatcher found for ${node.nodetype}`
      );
    }

    return this.dispatchers[node.nodetype].dispatch(
      node, state
    );

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
    if (!exists(this.dispatchers[node.nodetype])) {
      throw new Error(
        `XFlowDispatcherDynamic : no dispatcher found for ${node.nodetype}`
      );
    }

    return this.dispatchers[node.nodetype].dispatchQ(
      node, state
    );

  }

}

export default XFlowDispatcherDynamic;
