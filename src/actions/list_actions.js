import RSVP from 'rsvp';

import { exists } from '../util/lang';

//
// List operations
//

const ListNDProxyQ = {
  fetchQuery: (node, state)=> {
    const defer = RSVP.defer();
    console.log('ListNDProxyQ.fetchQueryQ');
    defer.resolve(state);
    return defer.promise;
  },
  updateQuery: (node, state)=> {
    const defer = RSVP.defer();
    console.log('ListNDProxyQ.updateQueryQ');
    defer.resolve(state);
    return defer.promise;
  },
  deleteQuery: (node, state)=> {
    const defer = RSVP.defer();
    console.log('ListNDProxyQ.deleteQueryQ');
    defer.resolve(state);
    return defer.promise;
  },
};

const ListNDProxy = {
  fetchQuery: (node, state)=> {
    console.log('ListNDProxy.fetchQuery');
    return state;
  },
  updateQuery: (node, state)=> {
    console.log('ListNDProxy.updateQuery');
    return state;
  },
  deleteQuery: (node, state)=> {
    console.log('ListNDProxy.deleteQuery');
    return state;
  },
};

const listNodeActions = {
  'retrieve': 'fetchQuery',
  'update': 'updateQuery',
  'delete': 'deleteQuery',
};

const DispatchQ = (node, state)=> {
  const defer = RSVP.defer();
  const method = node.action;

  if (!exists(method)) {
    defer.reject('No list/action dispatch for ', node.action);
  }

  ListNDProxyQ[method](node, state).then(
    (state)=> {
      return defer.resolve(state);
    },
    (err)=> {
      return defer.reject(err);
    }
  );

  return defer.promise;
};
const Dispatch = (node, state)=> {
  const method = node.action;

  if (!exists(method)) {
    throw new Error('No list/action dispatch for ', node.action);
  }

  return ListNDProxy[method](node, state);
};

export {
  Dispatch,
  DispatchQ,
};

export default {
  Dispatch,
  DispatchQ,
};

