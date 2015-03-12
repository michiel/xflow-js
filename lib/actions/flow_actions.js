import RSVP from 'rsvp';

import Flox from '../flox';
import Util from '../flow-util';

const exists = Util.exists;

function checkBranchingConditions(node, state) {
  if (!(
    (node.type === 'flow') &&
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

}

const FlowNDProxyQ = {
  start : function(node, state) {
    // console.log('FlowNDProxyQ.start');
    const defer = RSVP.defer();
    defer.resolve(state);
    return defer.promise;
  },
  end : function(node, state) {
    // console.log('FlowNDProxyQ.end');
    const defer = RSVP.defer();
    defer.resolve(state);
    return defer.promise;
  },
  flox: function(node, state) {
    // console.log('FlowNDProxyQ.flox');
    return Flox.evaluateExpressionQ(node, state);
  },
  branch : function(node, state) {
    // console.log('FlowNDProxyQ.branch');
    const defer = RSVP.defer();
    try {
      checkBranchingConditions(node, state);
    } catch(e) {
      defer.reject(e.message);
    }
    defer.resolve(state);
    return defer.promise;
  }
};

const FlowNDProxy = {
  start : function(node, state) {
    // console.log('FlowNDProxy.start');
    return state;
  },
  end : function(node, state) {
    // console.log('FlowNDProxy.end');
    return state;
  },
  flox : function(node, state) {
    // console.log('FlowNDProxy.flox');
    return Flox.evaluateExpression(node, state);
  },
  branch : function(node, state) {
    // console.log('FlowNDProxy.branch');
    checkBranchingConditions(node, state);
    return state;
  }
};

const flowNodeActions = {
  'start'  : 'start',
  'end'    : 'end',
  'flox'   : 'flox',
  'branch' : 'branch'
};

function Dispatch(node, state) {
  const method = flowNodeActions[node.action];

  if (!!!method) {
    throw new Error('No flow/action dispatch for ' + node.action);
  }
  return FlowNDProxy[flowNodeActions[node.action]](node, state);
}

function DispatchQ(node, state) {
  const defer  = RSVP.defer();
  const method = flowNodeActions[node.action];

  if (!!!method) {
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
}

export default {
  Dispatch  : Dispatch,
  DispatchQ : DispatchQ
};

