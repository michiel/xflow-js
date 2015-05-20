import RSVP from 'rsvp';

import LangUtil from '../util/lang';

const exists = LangUtil.exists;

//
// Object operations
//

var ObjectNDProxy = {
  fetchObject : function(node, state) {
    // console.log('ObjectNDProxy.fetchObject');
    return state;
  },
  createObject : function(node, state) {
    // console.log('ObjectNDProxy.createObject');
    return state;
  },
  saveObject : function(node, state) {
    // console.log('ObjectNDProxy.saveObject');
    return state;
  },
  setAttributes : function(node, state) {
    // console.log('ObjectNDProxy.setAttributes');
    return state;
  }
};

var ObjectNDProxyQ = {
  fetchObject : function(node, state) {
    // console.log('ObjectNDProxyQ.fetchObject');
    const defer = RSVP.defer();
    defer.resolve(state);
    return defer.promise;
  },
  createObject : function(node, state) {
    // console.log('ObjectNDProxyQ.createObject');
    const defer = RSVP.defer();
    defer.resolve(state);
    return defer.promise;
  },
  saveObject : function(node, state) {
    // console.log('ObjectNDProxyQ.saveObject');
    const defer = RSVP.defer();
    defer.resolve(state);
    return defer.promise;
  },
  setAttributes : function(node, state) {
    // console.log('ObjectNDProxyQ.setAttributes');
    const defer = RSVP.defer();
    defer.resolve(state);
    return defer.promise;
  }
};

const objectNodeActions = {
  'retrieve'      : 'fetchObject',
  'create'        : 'createObject',
  'save'          : 'saveObject',
  'setattributes' : 'setAttributes'
};

function Dispatch(node, state) {
  const method = objectNodeActions[node.action];

  if (!exists(method)) {
    throw new Error('No object/action dispatch for ' + node.action);
  }

  return ObjectNDProxy[method](node, state);
}

function DispatchQ(node, state) {
  const defer  = RSVP.defer();
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
}

export default {
  Dispatch    : Dispatch,
  DispatchQ   : DispatchQ
};
