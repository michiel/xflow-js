import RSVP  from 'rsvp';
import FloxParser from '../ext/parser/flox.js';

var parse = FloxParser.parse;

var expRE = /(\$[\w\.]*)/g;

function substituteExpression(expr, state) {

  return expr.replace(expRE,
    (match) => {
      var key = match.slice(1, match.length); // Remove '$'
      if (state[key] === undefined) {
        throw new Error('flox.substituteExpression : No match found for value ' + match);
      } else {
        var val = state[key];
        switch (typeof(val)) {
        case 'number':
          return val;
        case 'boolean':
          return (val + '').toUpperCase();
        case 'string':
          return '"' + val + '"';
        case 'object':
          if (val instanceof Date) {
            return +val;
          } else {
            throw new Error('flox.substituteExpression : invalid value found for ' + key);
          }
          break;
        default:
          throw new Error('flox.substituteExpression : invalid value found for ' + key);
        }
      }
    }
  );

}

function isValidExprNode(node) {
  if (!!!node ||
    !!!node.parameters ||
    !!!node.parameters.expression ||
    !!!node.parameters.returns
  ) {
    throw new Error('flox.evaluateExpression : Invalid node parameter, aborting');
  }
}

function evaluateExpression(node, state) {
  isValidExprNode(node);

  if (!!!state) {
    throw new Error('flox.evaluateExpression : NO STATE');
  }

  var params = node.parameters;
  var expr   = params.expression;

  var subbedExpr = substituteExpression(expr, state);

  console.log('subbedExpr : ' + subbedExpr);
  var subRes = parse(subbedExpr);
  console.log('sub res : ' + subRes);
  console.log('state', state);
  console.log('params ', params);

  state[params.returns.name] = parse(subbedExpr);

  return state;

}

//
// async wrappers
//

function parseQ(expr) {
  var defer = RSVP.defer();

  //
  // XXX: Does not have reject
  //

  defer.resolve(parse(expr));

  return defer.promise;
}

function substituteExpressionQ(expr, state) {
  var defer = RSVP.defer();

  //
  // XXX: Does not have reject
  //

  defer.resolve(substituteExpression(expr, state));

  return defer.promise;
}

function evaluateExpressionQ(node, state) {
  var defer = RSVP.defer();

  //
  // XXX: Does not have reject
  //

  defer.resolve(evaluateExpression(node, state));

  return defer.promise;
}

//
// parse and substituteExpression are primarily exposed for testing
//

export default {
  parse                 : parse,
  evaluateExpression    : evaluateExpression,
  substituteExpression  : substituteExpression,
  parseQ                : parseQ,
  substituteExpressionQ : substituteExpressionQ,
  evaluateExpressionQ   : evaluateExpressionQ
};
