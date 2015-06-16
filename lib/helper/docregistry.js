import LangUtil from '../util/lang';

const exists = LangUtil.exists;
const clone  = LangUtil.clone;

/**
 * DocRegistry
 * @class DocRegistry
 */
class DocRegistry {

  /**
   * DocRegistry
   * @class DocRegistry
   * @constructor DocRegistry
   */
  constructor() {
    this.name = 'DocRegistry';
    this._docs = {};
  }

  /**
   * Add a document with ID to the registry
   * @method add
   * @param {Object} JSON document with ID
   * @throws {Error} if a document with ID already exists
   */
  add(doc) {
    if (exists(this._docs[doc.id])) {
      throw new Error(
        `${this.name}.add : doc '${doc.id}' already in registry`
      );
    }
    this._docs[doc.id] = clone(doc);
  }

  /**
   * Remove a document with ID from the registry
   * @method remove
   * @param {Number} id
   */
  remove(id) {
    delete this._docs[id];
  }

  /**
   * Test if a document with ID exists in the registry
   * @method has
   * @param {Number} id
   * @return {Boolean}
   */
  has(id) {
    return exists(this._docs[id]);
  }

  /**
   * Retrieve a document with ID from the registry
   * @method get
   * @param {Number} id
   * @return {Object} JSON document
   * @throws {Error} if a document with ID does not exist in the registry
   */
  get(id) {
    if (!exists(this._docs[id])) {
      throw new Error(
        `${this.name}.get : doc '${id}' not in registry`
      );
    }
    return clone(this._docs[id]);
  }

}

export default DocRegistry;
