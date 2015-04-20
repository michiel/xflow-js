import LangUtil       from '../util/lang';

const exists = LangUtil.exists;

function AssignmentExpressionNode(left, operator, right) {
  return {
    'type'     : 'AssignmentExpression',
    'operator' : operator,
    'left'     : left,
    'right'    : right
  };
}

function IdentifierNode(name) {
  return {
    'type' : 'Identifier',
    'name' : name
  };
}

function ProgramNode(body=[]) {
  body = [].concat(body);
  return {
    'type' : 'Program',
    'body' : body
  };
}

function DebuggerStatementNode() {
  return {
    'type' : 'DebuggerStatement'
  };
}

function EmptyStatementNode() {
  return {
    'type' : 'EmptyStatement'
  };
}

function ExpressionStatementNode(exp) {
  return {
    'type'       : 'ExpressionStatement',
    'expression' : exp

  };
}

function IfStatementNode(tst, con, alt) {
  return {
    'type'       : 'IfStatement',
    'test'       : tst,
    'consequent' : BlockStatementNode(con),
    'alternate'  : BlockStatementNode(alt)
  };
}

function BinaryExpressionNode(operator, left, right) {
  return {
    'type'     : 'BinaryExpression',
    'operator' : operator,
    'left'     : left,
    'right'    : right
  };
}

function BlockStatementNode(body=[]) {
  body = [].concat(body);
  return {
    'type' : 'BlockStatement',
    'body' : body
  };
}

function LiteralNode(p) {
  return {
    'type'  : 'Literal',
    'value' : p,
    'raw'   : p
  };
}

function MemberExpressionNode(obj, prop) {
  return {
    'type' : 'MemberExpression',
    'computed' : false,
    'object'   :  IdentifierNode(obj),
    'property' : IdentifierNode(prop)
  };
}

function ReturnStatementNode(arg) {
  return {
    'type'     : 'ReturnStatement',
    'argument' : (exists(arg) ? arg : {})
  };
}

function FunctionDeclarationNode(name, params=[], body=[]) {
  body = [].concat(body);
  return {
    'type'     : 'FunctionDeclaration',
    'id'       : IdentifierNode(name),
    'params'   : params.map(IdentifierNode),
    'defaults' : [],
    'body'     : BlockStatementNode(body)
  };
}

function CallExpressionNode(name, args=[]) {
  args = [].concat(args);
  return {
    'type'      : 'CallExpression',
    'callee'    : IdentifierNode(name),
    'arguments' : args
  };
}

function ObjectExpressionNode(props=[]) {
  return {
    'type' : 'ObjectExpression',
    'properties' : props.map((arr)=> {
      return {
        'type'      : 'Property',
        'key'       : LiteralNode(arr[0]),
        'value'     : LiteralNode(arr[1]),
        'computed'  : false,
        'kind'      : 'init',
        'method'    : false,
        'shorthand' : false
      };
    })
  };
}

function ArrayExpressionNode(elements=[]) {
  return {
    'type' : 'ArrayExpression',
    'elements' : elements
  };
}

export default {
  ArrayExpression     : ArrayExpressionNode,
  BinaryExpression    : BinaryExpressionNode,
  BlockStatement      : BlockStatementNode,
  CallExpression      : CallExpressionNode,
  DebuggerStatement   : DebuggerStatementNode,
  EmptyStatement      : EmptyStatementNode,
  ExpressionStatement : ExpressionStatementNode,
  FunctionDeclaration : FunctionDeclarationNode,
  Identifier          : IdentifierNode,
  IfStatement         : IfStatementNode,
  Literal             : LiteralNode,
  MemberExpression    : MemberExpressionNode,
  ObjectExpression    : ObjectExpressionNode,
  Program             : ProgramNode,
  ReturnStatement     : ReturnStatementNode
};
