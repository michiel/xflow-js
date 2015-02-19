var RSVP = require('rsvp');

//
// List operations
//

var ListNDProxy = {
  fetchQueryQ: function(node, state) {
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  },
  updateQueryQ: function(node, state) {
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  },
  deleteQueryQ : function(node, state) {
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  }
};

function ListNodeDispatch(node, state) {
  var defer = RSVP.defer();

  var method = '';

  switch(node.action) {
  case 'retrieve':
    method = 'fetchQueryQ';
    break;

  default:
    defer.reject('No list/action dispatch for ', node.action);
  }

  ListNDProxy[method].apply(null, arguments).then(
    function(res) {
      return res;
    },
    function(err) {
      defer.reject(err);
    }
  );

  return defer.promise;
}

//
// Variable operations
//

var VariableNDProxy = {
  set : function(node, state) {
    console.log('set variable');
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  }
};

function VariableNodeDispatch(node, state) {
  var defer = RSVP.defer();

  var method = '';

  switch(node.action) {
  case 'set':
    method = 'setVariableQ';
    break;

  default:
    defer.reject('No list/action dispatch for ', node.action);
  }

  VariableNodeDispatch[method].apply(null, arguments).then(
    function(res) {
      return res;
    },
    function(err) {
      defer.reject(err);
    }
  );

  return defer.promise;
}

//
// Object operations
//

var ObjectNDProxy = {
  fetchObject : function(node, state) {
    return true;
  },
  createObject : function(node, state) {
    return true;
  },
  saveObject : function(node, state) {
    return true;
  },
  setAttributes : function(node, state) {
    return true;
  }
};

var ObjectNDProxyQ = {
  fetchObject : function(node, state) {
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  },
  createObject : function(node, state) {
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  },
  saveObject : function(node, state) {
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  },
  setAttributes : function(node, state) {
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  }
};

function ObjectNodeDispatch(node, state) {

  var method = '';
  switch(node.action) {
  case 'retrieve':
    method = 'fetchObject';
    break;
  case 'create':
    method = 'createObject';
    break;
  case 'save':
    method = 'saveObject';
    break;
  case 'setattributes':
    method = 'setAttributes';
    break;

  default:
    throw new Error('No object/action dispatch for ' + node.action);
  }

  return ObjectNDProxy[method].apply(null, arguments);
}

function ObjectNodeDispatchQ(node, state) {
  var defer = RSVP.defer();

  var method = '';

  switch(node.action) {
  case 'retrieve':
    method = 'fetchObject';
    break;
  case 'save':
    method = 'saveObject';
    break;
  case 'create':
    method = 'createObject';
    break;

  default:
    defer.reject('No object/action dispatch for ', node.action);
  }

  ObjectNDProxyQ[method].apply(null, arguments).then(
    function(res) {
      return res;
    },
    function(err) {
      defer.reject(err);
    }
  );

  return defer.promise;
}

//
// Flows
//

var FlowNDProxyQ = {
  start : function() {
    console.log('start flow');
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  },
  end : function() {
    console.log('end flow');
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  }
};

var FlowNDProxy = {
  start : function() {
    console.log('start flow');
    return true;
  },
  end : function() {
    console.log('end flow');
    return true;
  }
};

function FlowNodeDispatch(node) {
  var method = '';
  switch(node.action) {
  case 'start':
    method = 'start';
    break;
  case 'end':
    method = 'end';
    break;
  default:
    throw new Error('No flow/action dispatch for ' + node.action);
  }

  return FlowNDProxy[method].apply(null, arguments);

}

function FlowNodeDispatchQ(node) {
  var defer = RSVP.defer();

  switch(node.action) {
  case 'start':
    method = 'start';
    break;
  case 'end':
    method = 'end';
    break;
  default:
    defer.reject('No flow/action dispatch for ', node.action);
  }

  FlowNDProxy[method].apply(null, arguments).then(
    function(res) {
      return res;
    },
    function(err) {
      defer.reject(err);
    }
  );

  return defer.promise;
}

module.exports = {
  ObjectNodeDispatch    : ObjectNodeDispatch,
  ObjectNodeDispatchQ   : ObjectNodeDispatchQ,
  FlowNodeDispatch      : FlowNodeDispatch,
  FlowNodeDispatchQ     : FlowNodeDispatchQ,
  ListNodeDispatch      : ListNodeDispatch,
  ListNodeDispatchQ     : ListNodeDispatchQ,
  VariableNodeDispatch  : VariableNDProxy,
  VariableNodeDispatchQ : VariableNDProxyQ
};

