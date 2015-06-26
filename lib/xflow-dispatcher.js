import RSVP from 'rsvp';
import LangUtil from './util/lang';

const exists           = LangUtil.exists;

function assertValidDispatcher(name, dispatcher) {
  if (!LangUtil.isFunction(
    dispatcher.dispatch
  )) {
    throw new Error(
      `assertValidDispatcher : Dispatcher ${name} does not implement 'dispatch' method`
    );
  }
  if (!LangUtil.isFunction(
    dispatcher.dispatchQ
  )) {
    throw new Error(
      `assertValidDispatcher : Dispatcher ${name} does not implement 'dispatchQ' method`
    );
  }
  if (!LangUtil.isNumber(
    dispatcher.version
  )) {
    throw new Error(
      `assertValidDispatcher : Dispatcher ${name} does not have a version method`
    );
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
 * @class XFlowDispatcher
 */
class XFlowDispatcher {

  /**
   * XFlowDispatcher class
   *
   * @class XFlowDispatcher
   * @constructor XFlowDispatcher
   * @param {Object} dispatchers
   * @throws {Error} On invalid dispatchers
   */
  constructor(dispatchers={}) {
    this.name         = 'XFlowDispatcher';
    this.dispatchers  = {};

    this.addDispatchers(dispatchers);
  }

  addDispatcher(name, dispatcher) {
    assertValidDispatcher(name, dispatcher);
    if (exists(this.dispatchers[name])) {
      throw new Error(
        `${this.name}.addDispatcher : a dispatcher called '${name}' already exists`
      );
    }
    this.dispatchers[name] = dispatcher;
    this.capabilities = buildCapabilities(this.dispatchers);
  }

  addDispatchers(dispatchers={}) {
    for (let key in dispatchers) {
      this.addDispatcher(key, dispatchers[key]);
    }
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
        `${this.name}.processNode : no dispatcher found for ${node.nodetype}`
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
    const defer = RSVP.defer();
    if (!exists(this.dispatchers[node.nodetype])) {
      defer.reject(
        `${this.name}.processNode : no dispatcher found for ${node.nodetype}`
      );
    }

    this.dispatchers[node.nodetype].dispatchQ(
      node, state
    ).then(
      (state) => {
        // console.log('processNodeQ - resolve', state);
        defer.resolve(state);
        return state;
      },
      (err) => {
        console.error(
          `${this.name}.processNodeQ error : `, err
        );
        defer.reject(err);
      }
    );

    return defer.promise;
  }

}

export default XFlowDispatcher;
