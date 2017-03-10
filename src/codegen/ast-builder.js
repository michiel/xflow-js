import LangUtil from '../util/lang';
import Assert from '../util/assert';

const exists = LangUtil.exists;

const AssignmentExpressionNode = (left, operator, right)=> {
  return {
    'type': 'AssignmentExpression',
    'operator': operator,
    'left': left,
    'right': right,
  };
};

const IdentifierNode = (name)=> {
  return {
    'type': 'Identifier',
    'name': name,
  };
};

const ProgramNode = (body = [])=> {
  body = [].concat(body);
  return {
    'type': 'Program',
    'body': body,
  };
};

const DebuggerStatementNode = ()=> {
  return {
    'type': 'DebuggerStatement',
  };
};

const ThrowStatementNode = (arg)=> {
  Assert.exists(arg);
  return {
    'type': 'ThrowStatement',
    'argument': arg,
  };
};

const EmptyStatementNode = ()=> {
  return {
    'type': 'EmptyStatement',
  };
};

const ExpressionStatementNode = (exp)=> {
  return {
    'type': 'ExpressionStatement',
    'expression': exp,

  };
};

const IfStatementNode = (tst, con, alt)=> {
  return {
    'type': 'IfStatement',
    'test': tst,
    'consequent': BlockStatementNode(con),
    'alternate': exists(alt) ? BlockStatementNode(alt) : null,
  };
};

const BinaryExpressionNode = (operator, left, right)=> {
  return {
    'type': 'BinaryExpression',
    'operator': operator,
    'left': left,
    'right': right,
  };
};

const BlockStatementNode = (body = [])=> {
  body = [].concat(body);
  return {
    'type': 'BlockStatement',
    'body': body,
  };
};

const LiteralNode = (p)=> {
  return {
    'type': 'Literal',
    'value': p,
    'raw': p,
  };
};

const MemberExpressionNode = (obj, prop)=> {
  return {
    'type': 'MemberExpression',
    'computed': false,
    'object': IdentifierNode(obj),
    'property': IdentifierNode(prop),
  };
};

const ReturnStatementNode = (arg)=> {
  return {
    'type': 'ReturnStatement',
    'argument': (exists(arg) ? arg : {}),
  };
};

const FunctionDeclarationNode = (name, params = [], body = [])=> {
  body = [].concat(body);
  return {
    'type': 'FunctionDeclaration',
    'id': IdentifierNode(name),
    'params': params.map(IdentifierNode),
    'defaults': [],
    'body': BlockStatementNode(body),
  };
};

const CallExpressionNode = (fn, args = [])=> {
  args = [].concat(args);
  return {
    'type': 'CallExpression',
    'callee': fn,
    'arguments': args,
  };
};

const NewExpressionNode = (fn, args = [])=> {
  args = [].concat(args);
  return {
    'type': 'NewExpression',
    'callee': fn,
    'arguments': args,
  };
};

const ObjectExpressionNode = (props = [])=> {
  return {
    'type': 'ObjectExpression',
    'properties': props,
  };
};

const PropertyNode = (key, value)=> {
  return {
    'type': 'Property',
    'key': key,
    'value': value,
    'computed': false,
    'kind': 'init',
    'method': false,
    'shorthand': false,
  };
};

const ArrayExpressionNode = (elements = [])=>{
  return {
    'type': 'ArrayExpression',
    'elements': elements,
  };
};

const VariableDeclaratorNode = (varname, varinit)=> {
  return {
    'type': 'VariableDeclaration',
    'declarations': [
      {
        'type': 'VariableDeclarator',
        'id': {
          'type': 'Identifier',
          'name': varname,
        },
        'init': varinit || null,
      },
    ],
    'kind': 'var',
  };
};

export default {
  ArrayExpression: ArrayExpressionNode,
  AssignmentExpression: AssignmentExpressionNode,
  BinaryExpression: BinaryExpressionNode,
  BlockStatement: BlockStatementNode,
  CallExpression: CallExpressionNode,
  DebuggerStatement: DebuggerStatementNode,
  EmptyStatement: EmptyStatementNode,
  ExpressionStatement: ExpressionStatementNode,
  FunctionDeclaration: FunctionDeclarationNode,
  Identifier: IdentifierNode,
  IfStatement: IfStatementNode,
  Literal: LiteralNode,
  MemberExpression: MemberExpressionNode,
  NewExpression: NewExpressionNode,
  ObjectExpression: ObjectExpressionNode,
  Program: ProgramNode,
  Property: PropertyNode,
  ReturnStatement: ReturnStatementNode,
  ThrowStatement: ThrowStatementNode,
  VariableDeclarator: VariableDeclaratorNode,
};
