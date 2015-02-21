var RSVP = require('rsvp');
var Flox = require('./flox');

//
// List operations
//

var ListNDProxyQ = {
  fetchQueryQ: function(node, state) {
    var defer = RSVP.defer();
    console.log('ListNDProxyQ.fetchQueryQ');
    defer.resolve(true);
    return defer.promise;
  },
  updateQueryQ: function(node, state) {
    var defer = RSVP.defer();
    console.log('ListNDProxyQ.updateQueryQ');
    defer.resolve(true);
    return defer.promise;
  },
  deleteQueryQ : function(node, state) {
    var defer = RSVP.defer();
    console.log('ListNDProxyQ.deleteQueryQ');
    defer.resolve(true);
    return defer.promise;
  }
};

function ListNodeDispatchQ(node, state) {
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
      return defer.resolve(res);
    },
    function(err) {
      return defer.reject(err);
    }
  );

  return defer.promise;
}

var ListNDProxy = {
  fetchQuery: function(node, state) {
    console.log('ListNDProxy.fetchQuery');
    return true;
  },
  updateQuery: function(node, state) {
    console.log('ListNDProxy.updateQuery');
    return true;
  },
  deleteQuery : function(node, state) {
    console.log('ListNDProxy.deleteQuery');
    return true;
  }
};

function ListNodeDispatch(node, state) {

  var method = '';

  switch(node.action) {
  case 'retrieve':
    method = 'fetchQuery';
    break;

  default:
    defer.reject('No list/action dispatch for ', node.action);
  }

  return ListNDProxy[method].apply(null, arguments);
}

//
// Variable operations
//

var VariableNDProxyQ = {
  set : function(node, state) {
    console.log('VariableNDProxyQ.set');
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  }
};

function VariableNodeDispatchQ(node, state) {
  var defer = RSVP.defer();

  var method = '';

  switch(node.action) {
  case 'set':
    method = 'setQ';
    break;

  default:
    defer.reject('No list/action dispatch for ', node.action);
  }

  VariableNodeDispatch[method].apply(null, arguments).then(
    function(res) {
      return defer.promise(res);
    },
    function(err) {
      return defer.reject(err);
    }
  );

  return defer.promise;
}

var VariableNDProxy = {
  set : function(node, state) {
    console.log('VariableNDProxy.set');
    return true;
  }
};

function VariableNodeDispatch(node, state) {
  var method = '';

  switch(node.action) {
  case 'set':
    method = 'setVariable';
    break;

  default:
    defer.reject('No list/action dispatch for ', node.action);
  }

  return VariableNodeDispatch[method].apply(null, arguments);
}

//
// Object operations
//

var ObjectNDProxy = {
  fetchObject : function(node, state) {
    console.log('ObjectNDProxy.fetchObject');
    return true;
  },
  createObject : function(node, state) {
    console.log('ObjectNDProxy.createObject');
    return true;
  },
  saveObject : function(node, state) {
    console.log('ObjectNDProxy.saveObject');
    return true;
  },
  setAttributes : function(node, state) {
    console.log('ObjectNDProxy.setAttributes');
    return true;
  }
};

var ObjectNDProxyQ = {
  fetchObject : function(node, state) {
    console.log('ObjectNDProxyQ.fetchObject');
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  },
  createObject : function(node, state) {
    console.log('ObjectNDProxyQ.createObject');
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  },
  saveObject : function(node, state) {
    console.log('ObjectNDProxyQ.saveObject');
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  },
  setAttributes : function(node, state) {
    console.log('ObjectNDProxyQ.setAttributes');
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
  case 'setattributes':
    method = 'setAttributes';
    break;

  default:
    console.error('No object/action dispatch for ', node.action);
    defer.reject('No object/action dispatch for ', node.action);
  }

  ObjectNDProxyQ[method](node, state).then(
    function(res) {
      return defer.resolve(res);
    },
    function(err) {
      return defer.reject(err);
    }
  );

  return defer.promise;
}

//
// Flows
//

var FlowNDProxyQ = {
  start : function() {
    console.log('FlowNDProxyQ.start');
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  },
  end : function() {
    console.log('FlowNDProxyQ.end');
    var defer = RSVP.defer();
    defer.resolve(true);
    return defer.promise;
  },
  flox: function(node, state) {
    console.log('FlowNDProxyQ.flox');
    return Flox.evaluateExpressionQ(node, state);
  }
};

var FlowNDProxy = {
  start : function() {
    console.log('FlowNDProxy.start');
    return true;
  },
  end : function() {
    console.log('FlowNDProxy.end');
    return true;
  },
  flox : function(node, state) {
    console.log('FlowNDProxy.flox');
    return Flox.evaluateExpression(node, state);
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
  case 'flox':
    method = 'flox';
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
  case 'flox':
    method = 'flox';
    break;
  default:
    defer.reject('No flow/action dispatch for ', node.action);
  }

  FlowNDProxy[method].apply(null, arguments).then(
    function(res) {
      return defer.resolve(res);
    },
    function(err) {
      return defer.reject(err);
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

