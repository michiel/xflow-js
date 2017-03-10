import RSVP from 'rsvp';

import LangUtil from '../util/lang';

const exists = LangUtil.exists;

//
// Object operations
//

const ObjectNDProxy = {
  fetchObject: (node, state)=> {
    // console.log('ObjectNDProxy.fetchObject');
    return state;
  },
  createObject: (node, state)=> {
    // console.log('ObjectNDProxy.createObject');
    return state;
  },
  saveObject: (node, state)=> {
    // console.log('ObjectNDProxy.saveObject');
    return state;
  },
  setAttributes: (node, state)=> {
    // console.log('ObjectNDProxy.setAttributes');
    return state;
  },
};

const ObjectNDProxyQ = {
  fetchObject: (node, state)=> {
    // console.log('ObjectNDProxyQ.fetchObject');
    const defer = RSVP.defer();
    defer.resolve(state);
    return defer.promise;
  },
  createObject: (node, state)=> {
    // console.log('ObjectNDProxyQ.createObject');
    const defer = RSVP.defer();
    defer.resolve(state);
    return defer.promise;
  },
  saveObject: (node, state)=> {
    // console.log('ObjectNDProxyQ.saveObject');
    const defer = RSVP.defer();
    defer.resolve(state);
    return defer.promise;
  },
  setAttributes: (node, state)=> {
    // console.log('ObjectNDProxyQ.setAttributes');
    const defer = RSVP.defer();
    defer.resolve(state);
    return defer.promise;
  },
};

const objectNodeActions = {
  'retrieve': 'fetchObject',
  'create': 'createObject',
  'save': 'saveObject',
  'setattributes': 'setAttributes',
};

const Dispatch = (node, state)=> {
  const method = objectNodeActions[node.action];

  if (!exists(method)) {
    throw new Error('No object/action dispatch for ' + node.action);
  }

  return ObjectNDProxy[method](node, state);
};

const DispatchQ = (node, state)=> {
  const defer = RSVP.defer();
  const method = objectNodeActions[node.action];

  if (!exists(method)) {
    defer.reject('No object/action dispatch for ' + node.action);
  }

  ObjectNDProxyQ[method](node, state).then(
    (state) => {
      return defer.resolve(state);
    },
    (err) => {
      return defer.reject(state);
    }
  );

  return defer.promise;
};

export default {
  Dispatch: Dispatch,
  DispatchQ: DispatchQ,
};
