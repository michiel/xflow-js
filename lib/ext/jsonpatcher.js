import jsonpatch from 'fast-json-patch';

class Patcher {

  constructor(args={}) {
  }

  diff(a, b) {
    return jsonpatch.compare(a, b);
  }

}



export default {
  create: function(args={}) {
    return new Patcher(args);
  }
};
