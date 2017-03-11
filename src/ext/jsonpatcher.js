import jsonpatch from 'fast-json-patch';

class Patcher {

  constructor(args = {}) {
  }

  diff(a, b) {
    return jsonpatch.compare(a, b);
  }

  bidiff(a, b) {
    return [
      jsonpatch.compare(a, b), // forward
      jsonpatch.compare(b, a),  // reverse/undo
    ];
  }

  patch(obj, diffs) {
    return jsonpatch.apply(obj, diffs);
  }

}

const create = (args = {})=> {
  return new Patcher(args);
};

export default {
  create,
};
