import Assert from '../util/assert';
import { exists, clone } from '../util/lang';
import patcher from '../ext/jsonpatcher';

const diffPatcher = patcher.create({});

/**
 * Class mixin for Editable
 * @class editable
 */

const editable = {

  /**
   * initEditable, call this method in the constructor to initialize it
   * All methods will throw errors if called before this.
   *
   * @method initEditable
   */
  initEditable(prop = 'json') {
    this._editableProperty = prop;
    this._rdiffs = [];
  },

  /**
   * Called to ensure the emitter object exists
   *
   * @method _assertEditableInitialized
   * @private
   */
  _assertEditableInitialized(method = '') {
    if (!exists(this._rdiffs)) {
      throw new Error(
        `${this.name}.${method} : No editable stack found, check if initEditable() has been called`
      );
    }
  },

  makeChange(oldVal, newVal) {
    this._assertEditableInitialized('makeChange');

    //
    // F = Forward
    // R = Reverse
    //

    const [deltasF, deltasR] = diffPatcher.bidiff(
      oldVal,
      newVal
    );

    Assert.equal(deltasF.length, deltasR.length);

    if (deltasF.length > 0) {
      // console.log('deltas is ', JSON.stringify(deltas));
      /**
       * Fired when state changes, deltas supplied in JSON-PATCH format
       * @event change
       * @param {Array} deltas
       */
      this.emit('change', deltasF);
      this._rdiffs.push(deltasR);
    }
  },

  /**
   * Reverts the last change if there are any left to undo
   * The delta gets emitted as a forward change
   * @method undo
   * @return {Boolean}
   */
  undo() {
    this._assertEditableInitialized('undo');
    if (this._rdiffs.length > 0) {
      const delta = this._rdiffs.pop();
      diffPatcher.patch(this.json, delta);
      this.emit('change', delta);
      return true;
    } else {
      return false;
    }
  },

  /**
   * @method trackChanges
   * @param {Function} fn
   */
  trackChanges(fn) {
    this._assertEditableInitialized('wrapChange');
    const old = clone(this.json);
    fn();
    this.makeChange(old, clone(this.json));
  },

};

export default editable;
