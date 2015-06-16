import LangUtil from '../util/lang';

const exists = LangUtil.exists;
const clone  = LangUtil.clone;

class DocRegistry {

  constructor() {
    this.name = 'DocRegistry';
    this._docs = {};
  }

  add(doc) {
    if (exists(this._docs[doc.id])) {
      throw new Error(
        `${this.name}.add : doc '${doc.id}' already in registry`
      );
    }
    this._docs[doc.id] = clone(doc);
  }

  remove(id) {
    delete this._docs[id];
  }

  has(id) {
    return exists(this._docs[id]);
  }

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
