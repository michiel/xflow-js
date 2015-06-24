import eventemitter  from '../ext/eventemitter';

import { exists } from '../util/lang';

const emittable = {

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
   * Emit an event
   *
   * @method emit
   * @param {String} name
   * @param {ArrayArguments} parameters
   */
  emit(name, ...args) {

    if (!exists(this.emitter)) {
      throw new Error(
        `${this.name}.emit [${name}]: No emitter found, check if initEmittable() has been called`
      );
    }

    this.emitter.emit.apply(
      this.emitter,
      [name, this.id].concat(...args)
    );

  },

  /**
   * Register a listener callback for an event
   *
   * @method on
   * @param {String} name Name of the event to register on
   * @param {Function} callback Callback
   */
  on(...args) {

    if (!exists(this.emitter)) {
      throw new Error(
        `${this.name}.on : No emitter found, check if initEmittable() has been called`
      );
    }

    this.emitter.on.apply(this.emitter, args);
  },

  /**
   * Register a listener callback for any event
   *
   * @method onAny
   * @param {Function} callback Callback
   */
  onAny(...args) {

    if (!exists(this.emitter)) {
      throw new Error(
        `${this.name}.onAny : No emitter found, check if initEmittable() has been called`
      );
    }

    this.emitter.onAny.apply(this.emitter, args);
  }

};

export default emittable;
