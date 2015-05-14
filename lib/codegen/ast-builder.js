import LangUtil from '../util/lang';
import Assert   from '../util/assert';

const {
  exists
} = LangUtil;

function AssignmentExpression(left, operator, right) {
  return {
    'type'     : 'AssignmentExpression',
    'operator' : operator,
    'left'     : left,
    'right'    : right
  };
}

function Identifier(name) {
  return {
    'type' : 'Identifier',
    'name' : name
  };
}

function Program(body=[]) {
  body = [].concat(body);
  return {
    'type' : 'Program',
    'body' : body
  };
}

function DebuggerStatement() {
  return {
    'type' : 'DebuggerStatement'
  };
}

function ThrowStatement(arg) {
  Assert.exists(arg);
  return {
    'type'     : 'ThrowStatement',
    'argument' : arg
  };
}

function EmptyStatement() {
  return {
    'type' : 'EmptyStatement'
  };
}

function ExpressionStatement(exp) {
  return {
    'type'       : 'ExpressionStatement',
    'expression' : exp

  };
}

function IfStatement(tst, con, alt) {
  return {
    'type'       : 'IfStatement',
    'test'       : tst,
    'consequent' : BlockStatement(con),
    'alternate'  : exists(alt) ? BlockStatement(alt) : null
  };
}

function BinaryExpression(operator, left, right) {
  return {
    'type'     : 'BinaryExpression',
    'operator' : operator,
    'left'     : left,
    'right'    : right
  };
}

function BlockStatement(body=[]) {
  body = [].concat(body);
  return {
    'type' : 'BlockStatement',
    'body' : body
  };
}

function Literal(p) {
  return {
    'type'  : 'Literal',
    'value' : p,
    'raw'   : p
  };
}

function MemberExpression(obj, prop) {
  return {
    'type' : 'MemberExpression',
    'computed' : false,
    'object'   :  Identifier(obj),
    'property' : Identifier(prop)
  };
}

function ReturnStatement(arg) {
  return {
    'type'     : 'ReturnStatement',
    'argument' : (exists(arg) ? arg : {})
  };
}

function FunctionDeclaration(name, params=[], body=[]) {
  body = [].concat(body);
  return {
    'type'     : 'FunctionDeclaration',
    'id'       : Identifier(name),
    'params'   : params.map(Identifier),
    'defaults' : [],
    'body'     : BlockStatement(body)
  };
}

function CallExpression(fn, args=[]) {
  args = [].concat(args);
  return {
    'type'      : 'CallExpression',
    'callee'    : fn,
    'arguments' : args
  };
}

function NewExpression(fn, args=[]) {
  args = [].concat(args);
  return {
    'type'      : 'NewExpression',
    'callee'    : fn,
    'arguments' : args
  };
}

function ObjectExpression(props=[]) {
  return {
    'type'       : 'ObjectExpression',
    'properties' : props
  };
}

function Property(key, value) {
    return {
      'type'      : 'Property',
      'key'       : key,
      'value'     : value,
      'computed'  : false,
      'kind'      : 'init',
      'method'    : false,
      'shorthand' : false
    };
}

function ArrayExpression(elements=[]) {
  return {
    'type' : 'ArrayExpression',
    'elements' : elements
  };
}

export default {
  ArrayExpression,
  AssignmentExpression,
  BinaryExpression,
  BlockStatement,
  CallExpression,
  DebuggerStatement,
  EmptyStatement,
  ExpressionStatement,
  FunctionDeclaration,
  Identifier,
  IfStatement,
  Literal,
  MemberExpression,
  NewExpression,
  ObjectExpression,
  Program,
  Property,
  ReturnStatement,
  ThrowStatement
};
