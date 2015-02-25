import RSVP from 'rsvp';
import Flox from './flox';

//
// List operations
//

var ListNDProxyQ = {
  fetchQueryQ: function(node, state) {
    var defer = RSVP.defer();
    console.log('ListNDProxyQ.fetchQueryQ');
    defer.resolve(state);
    return defer.promise;
  },
  updateQueryQ: function(node, state) {
    var defer = RSVP.defer();
    console.log('ListNDProxyQ.updateQueryQ');
    defer.resolve(state);
    return defer.promise;
  },
  deleteQueryQ : function(node, state) {
    var defer = RSVP.defer();
    console.log('ListNDProxyQ.deleteQueryQ');
    defer.resolve(state);
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

  ListNDProxyQ[method].apply(null, arguments).then(
    function(state) {
      return defer.resolve(state);
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
    return state;
  },
  updateQuery: function(node, state) {
    console.log('ListNDProxy.updateQuery');
    return state;
  },
  deleteQuery : function(node, state) {
    console.log('ListNDProxy.deleteQuery');
    return state;
  }
};

function ListNodeDispatch(node, state) {

  var method = '';

  switch(node.action) {
  case 'retrieve':
    method = 'fetchQuery';
    break;

  default:
    throw new Error('No list/action dispatch for ', node.action);
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
    defer.resolve(state);
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
    function(state) {
      return defer.promise(state);
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
    return state;
  }
};

function VariableNodeDispatch(node, state) {
  var method = '';

  switch(node.action) {
  case 'set':
    method = 'setVariable';
    break;

  default:
    throw new Error('No list/action dispatch for ', node.action);
  }

  return VariableNodeDispatch[method].apply(null, arguments);
}

//
// Object operations
//

var ObjectNDProxy = {
  fetchObject : function(node, state) {
    console.log('ObjectNDProxy.fetchObject');
    return state;
  },
  createObject : function(node, state) {
    console.log('ObjectNDProxy.createObject');
    return state;
  },
  saveObject : function(node, state) {
    console.log('ObjectNDProxy.saveObject');
    return state;
  },
  setAttributes : function(node, state) {
    console.log('ObjectNDProxy.setAttributes');
    return state;
  }
};

var ObjectNDProxyQ = {
  fetchObject : function(node, state) {
    console.log('ObjectNDProxyQ.fetchObject');
    var defer = RSVP.defer();
    defer.resolve(state);
    return defer.promise;
  },
  createObject : function(node, state) {
    console.log('ObjectNDProxyQ.createObject');
    var defer = RSVP.defer();
    defer.resolve(state);
    return defer.promise;
  },
  saveObject : function(node, state) {
    console.log('ObjectNDProxyQ.saveObject');
    var defer = RSVP.defer();
    defer.resolve(state);
    return defer.promise;
  },
  setAttributes : function(node, state) {
    console.log('ObjectNDProxyQ.setAttributes');
    var defer = RSVP.defer();
    defer.resolve(state);
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
    function(state) {
      return defer.resolve(state);
    },
    function(err) {
      return defer.reject(state);
    }
  );

  return defer.promise;
}

//
// Flows
//

var FlowNDProxyQ = {
  start : function(node, state) {
    console.log('FlowNDProxyQ.start');
    var defer = RSVP.defer();
    defer.resolve(state);
    return defer.promise;
  },
  end : function(node, state) {
    console.log('FlowNDProxyQ.end');
    var defer = RSVP.defer();
    defer.resolve(state);
    return defer.promise;
  },
  flox: function(node, state) {
    console.log('FlowNDProxyQ.flox');
    return Flox.evaluateExpressionQ(node, state);
  }
};

var FlowNDProxy = {
  start : function(node, state) {
    console.log('FlowNDProxy.start');
    return state;
  },
  end : function(node, state) {
    console.log('FlowNDProxy.end');
    return state;
  },
  flox : function(node, state) {
    console.log('FlowNDProxy.flox');
    return Flox.evaluateExpression(node, state);
  }
};

function FlowNodeDispatch(node, state) {
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

  var method;
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

  FlowNDProxyQ[method].apply(null, arguments).then(
    (state) => {
      return defer.resolve(state);
    },
    (err) => {
      return defer.reject(err);
    }
  );

  return defer.promise;
}

export default {
  ObjectNodeDispatch    : ObjectNodeDispatch,
  ObjectNodeDispatchQ   : ObjectNodeDispatchQ,
  FlowNodeDispatch      : FlowNodeDispatch,
  FlowNodeDispatchQ     : FlowNodeDispatchQ,
  ListNodeDispatch      : ListNodeDispatch,
  ListNodeDispatchQ     : ListNodeDispatchQ,
  VariableNodeDispatch  : VariableNDProxy,
  VariableNodeDispatchQ : VariableNDProxyQ
};

