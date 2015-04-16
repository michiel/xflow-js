import LangUtil       from '../util/lang';

const exists = LangUtil.exists;

function IdentifierNode(name) {
  return {
    'type' : 'Identifier',
    'name' : name
  };
}

function ProgramNode(body=[]) {
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

function BlockStatementNode(body=[]) {
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

function ReturnStatementNode(arg) {
  return {
    'type'     : 'ReturnStatement',
    'argument' : (exists(arg) ? arg : {})
  };
}

function FunctionDeclarationNode(name, params=[], body=[]) {
  return {
    'type'     : 'FunctionDeclaration',
    'id'       : IdentifierNode(name),
    'params'   : params.map(IdentifierNode),
    'defaults' : [],
    'body'     : BlockStatementNode(body)
  };
}

function CallExpressionNode(name, args=[]) {
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
  BlockStatement      : BlockStatementNode,
  CallExpression      : CallExpressionNode,
  DebuggerStatement   : DebuggerStatementNode,
  EmptyStatement      : EmptyStatementNode,
  ExpressionStatement : ExpressionStatementNode,
  FunctionDeclaration : FunctionDeclarationNode,
  Identifier          : IdentifierNode,
  ObjectExpression    : ObjectExpressionNode,
  Program             : ProgramNode,
  ReturnStatement     : ReturnStatementNode
};
