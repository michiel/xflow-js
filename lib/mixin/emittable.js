import eventemitter  from '../ext/eventemitter';

import Assert     from '../util/assert';
import { exists } from '../util/lang';

/**
 * Class mixin for Event emission
 * @class emittable
 */

const emittable = {

  /**
   * initEmittable, call this method in the constructor to initialize the
   * emitter. All methods will throw errors if called before this.
   *
   * @method initEmittable
   */
  initEmittable() {
    /**
     * Event emitter
     * @property emitter
     */
    this.emitter = eventemitter.create({
      wildcard : true
    });
  },

  /**
   * Called to ensure the emitter object exists
   *
   * @method _assertEmitterExists
   * @private
   */
  _assertEmitterExists(method='') {
    if (!exists(this.emitter)) {
      throw new Error(
        `${this.name}.${method} : No emitter found, check if initEmittable() has been called`
      );
    }
  },

  /**
   * Emit an event
   *
   * @method emit
   * @param {String} name
   * @param {ArrayArguments} parameters
   */
  emit(name) {
    Assert.isString(name);

    let args = [];
    for (let i = 1; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    this._assertEmitterExists('emit');
    const arglist = [
      name,
      { eventName : name }
    ].concat(args);

    this.emitter.emit.apply(
      this.emitter,
      arglist
    );

  },

  /**
   * Register a listener callback for an event
   *
   * @method on
   * @param {String} name Name of the event to register on
   * @param {Function} callback Callback
   */
  on() {
    this._assertEmitterExists('on');
    this.emitter.on.apply(this.emitter, arguments);
  },

  /**
   * Register a listener callback for any event
   *
   * @method onAny
   * @param {Function} callback Callback
   */
  onAny() {
    this._assertEmitterExists('onAny');
    this.emitter.onAny.apply(this.emitter, arguments);
  },

  /**
   * Remove a listener callback for an event
   *
   * @method off
   * @param {String} name Event name
   * @param {Function} callback Callback
   */
  off() {
    this._assertEmitterExists('off');
    this.emitter.off.apply(this.emitter, arguments);
  },

  /**
   * Remove a listener callback for any event
   *
   * @method offAny
   * @param {Function} callback Callback
   */
  offAny() {
    this._assertEmitterExists('offAny');
    this.emitter.offAny.apply(this.emitter, arguments);
  },

  /**
   * Register a listener callback for an event to fire once
   *
   * @method once
   * @param {String} name Name of the event to register on
   * @param {Function} callback Callback
   */
  once() {
    this._assertEmitterExists('once');
    this.emitter.once.apply(this.emitter, arguments);
  }

};

export default emittable;
