import RSVP from 'rsvp';

import Flox     from '../flox';
import LangUtil from '../util/lang';

const {
  exists
} = LangUtil;

const NDProxyQ = {
  'evalExpr': function(node, state) {
    return Flox.evaluateExpressionQ(node, state);
  }
};

const NDProxy = {
  'evalExpr' : function(node, state) {
    return Flox.evaluateExpression(node, state);
  }
};

const nodeActions = {
  'evalexpr' : 'evalExpr'
};

function Dispatch(node, state) {
  const method = nodeActions[node.action];

  if (!exists(method)) {
    throw new Error('No action dispatch for ' + node.action);
  }
  return NDProxy[nodeActions[node.action]](node, state);
}

function DispatchQ(node, state) {
  const defer  = RSVP.defer();
  const method = nodeActions[node.action];

  if (!exists(method)) {
    defer.reject('No action dispatch for ' + node.action);
  }

  NDProxyQ[nodeActions[node.action]](node, state).then(
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
  Dispatch,
  DispatchQ
};
