import RSVP from 'rsvp';

import LangUtil from '../util/lang';

const exists = LangUtil.exists;

const checkBranchingConditions = (node, state)=> {
  if (!(
    (node.nodetype === 'flow') &&
    (node.action === 'branch')
  )) {

    //
    // XXX: We shouldn't be here in the first place
    //

    throw new Error('flow.checkBranchingConditions : Not a branch node!');
  }

  if (
    !exists(node.parameters) ||
    !exists(node.parameters.name)
  ) {

    //
    // XXX: Maybe catch this with schema validation
    //

    throw new Error('flow.checkBranchingConditions : Incomplete parameters in branch node!');
  }

  //
  // XXX: Add type checking
  //

  if (!exists(state[node.parameters.name])) {
    throw new Error('flow.checkBranchingConditions : Cannot branch - no branching param in state!');
  }

  return true;

};

const FlowNDProxyQ = {
//   start : (node, state)=> {
//     // console.log('FlowNDProxyQ.start');
//     const defer = RSVP.defer();
//     defer.resolve(state);
//     return defer.promise;
//   },
  end: (node, state)=> {
    // console.log('FlowNDProxyQ.end');
    const defer = RSVP.defer();
    defer.resolve(state);
    return defer.promise;
  },
  branch: (node, state)=> {
    // console.log('FlowNDProxyQ.branch');
    const defer = RSVP.defer();
    try {
      checkBranchingConditions(node, state);
    } catch (e) {
      defer.reject(e.message);
    }
    defer.resolve(state);
    return defer.promise;
  },
};

const FlowNDProxy = {
//   start : (node, state)=> {
//     // console.log('FlowNDProxy.start');
//     return state;
//   },
  end: (node, state)=> {
    // console.log('FlowNDProxy.end');
    return state;
  },
  branch: (node, state)=> {
    // console.log('FlowNDProxy.branch');
    checkBranchingConditions(node, state);
    return state;
  },
};

const flowNodeActions = {
  // 'start'  : 'start',
  'end': 'end',
  'branch': 'branch',
};

const Dispatch = (node, state)=> {
  const method = flowNodeActions[node.action];

  if (!exists(method)) {
    throw new Error('No flow/action dispatch for ' + node.action);
  }
  return FlowNDProxy[flowNodeActions[node.action]](node, state);
};

const DispatchQ = (node, state)=> {
  const defer = RSVP.defer();
  const method = flowNodeActions[node.action];

  if (!exists(method)) {
    defer.reject('No flow/action dispatch for ' + node.action);
  }

  FlowNDProxyQ[flowNodeActions[node.action]](node, state).then(
    (state) => {
      return defer.resolve(state);
    },
    (err) => {
      return defer.reject(err);
    }
  );

  return defer.promise;
};

export default {
  Dispatch: Dispatch,
  DispatchQ: DispatchQ,
};

