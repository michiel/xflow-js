import RSVP from 'rsvp';

import Flox     from '../flox';
import LangUtil from '../util/lang';

const exists = LangUtil.exists;

const NDProxyQ = {
  'evalExpr': (node, state)=> {
    return Flox.evaluateExpressionQ(node, state);
  }
};

const NDProxy = {
  'evalExpr' : (node, state)=> {
    return Flox.evaluateExpression(node, state);
  }
};

const nodeActions = {
  'evalexpr' : 'evalExpr'
};

const Dispatch = (node, state)=> {
  const method = nodeActions[node.action];

  if (!exists(method)) {
    throw new Error('No action dispatch for ' + node.action);
  }
  return NDProxy[nodeActions[node.action]](node, state);
}

const DispatchQ = (node, state)=> {
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
  Dispatch  : Dispatch,
  DispatchQ : DispatchQ
};
