import RSVP from 'rsvp';

import LangUtil from '../util/lang';

const exists = LangUtil.exists;

//
// List operations
//

const ListNDProxyQ = {
  fetchQuery: function(node, state) {
    const defer = RSVP.defer();
    console.log('ListNDProxyQ.fetchQueryQ');
    defer.resolve(state);
    return defer.promise;
  },
  updateQuery: function(node, state) {
    const defer = RSVP.defer();
    console.log('ListNDProxyQ.updateQueryQ');
    defer.resolve(state);
    return defer.promise;
  },
  deleteQuery : function(node, state) {
    const defer = RSVP.defer();
    console.log('ListNDProxyQ.deleteQueryQ');
    defer.resolve(state);
    return defer.promise;
  }
};

const ListNDProxy = {
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

const listNodeActions = {
  'retrieve' : 'fetchQuery',
  'update'   : 'updateQuery',
  'delete'   : 'deleteQuery'
};

function DispatchQ(node, state) {
  const defer  = RSVP.defer();
  const method = node.action;

  if (!exists(method)) {
    defer.reject('No list/action dispatch for ', node.action);
  }

  ListNDProxyQ[method](node, state).then(
    function(state) {
      return defer.resolve(state);
    },
    function(err) {
      return defer.reject(err);
    }
  );

  return defer.promise;
}
function Dispatch(node, state) {
  const method = node.action;

  if (!exists(method)) {
    throw new Error('No list/action dispatch for ', node.action);
  }

  return ListNDProxy[method](node, state);
}

export default {
  Dispatch  : Dispatch,
  DispatchQ : DispatchQ
};

