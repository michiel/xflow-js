import RSVP       from 'rsvp';
import FloxParser from './flox-parser.js';
import langUtil   from './util/lang';

const parse      = FloxParser.parse;
const assertType = langUtil.assertType;
const exists     = langUtil.exists;

const wsRE  = /[\t\s]*/g;
const expRE = /(\$[\w\.]*)/g;

function noMatchErrorString(match, state) {
  const stateString = JSON.stringify(state);
  return (
    `flox.substituteExpression : No match found for value ${match} in ${stateString}`
  );
}

function substituteExpression(expr, state) {

  return expr.replace(wsRE, '').replace(expRE,
    (match) => {
      const key = match.slice(1, match.length); // Remove '$'
      if (!exists(state[key])) {
        throw new Error(noMatchErrorString(match, state));
      } else {
        const val = state[key];
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
  if (
    !exists(node) ||
    !exists(node.parameters) ||
    !exists(node.parameters.expression) ||
    !exists(node.parameters.returns) ||
    !exists(node.parameters.returns.name)
  ) {
    throw new Error('flox.evaluateExpression : Invalid node parameter, aborting');
  }
}

function evaluateExpression(node, state) {
  isValidExprNode(node);

  if (!exists(state)) {
    throw new Error('flox.evaluateExpression : NO STATE');
  }

  const params = node.parameters;
  const expr   = params.expression;

  const subbedExpr = substituteExpression(expr, state);
  // console.log('SUBBED ' + subbedExpr);
  const subRes     = parse(subbedExpr);
  // console.log('PARSED ' + subRes);

  assertType(params.returns.type, subRes);
  state[params.returns.name] = subRes;

  return state;

}

//
// async wrappers
//

function parseQ(expr) {
  const defer = RSVP.defer();

  //
  // XXX: Does not have reject
  //

  defer.resolve(parse(expr));

  return defer.promise;
}

function substituteExpressionQ(expr, state) {
  const defer = RSVP.defer();

  //
  // XXX: Does not have reject
  //

  defer.resolve(substituteExpression(expr, state));

  return defer.promise;
}

function evaluateExpressionQ(node, state) {
  const defer = RSVP.defer();

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
