import LangUtil       from '../util/lang';
import ASTBuilder     from './ast-builder';

const ast    = ASTBuilder;
const exists = LangUtil.exists;

function nodeName(id) {
  return `node${id}`;
}

function Program(body=[]) {
  return ast.Program([
    ast.FunctionDeclaration(
      'main',    // id
      ['scope'], // params
      body.concat(
        [
          ast.ReturnStatement(
            ast.ExpressionStatement(
              ast.ArrayExpression([
                ast.Identifier('scope')
              ])
            )
          )
        ]
      )
    ),
    ast.ExpressionStatement(
      ast.CallExpression(
        Identifier('main'),
        ast.ObjectExpression()
      ))
  ]);
}

function FlowNode(id, body=[]) {

  if (body.length === 0) {
    body.push(ast.EmptyStatement());
  }

  return ast.FunctionDeclaration(
    nodeName(id), // id
    [],           // params
    body
  );
}

function CallNode(id) {
  return ast.ExpressionStatement(
    ast.CallExpression(
      Identifier(
        nodeName(id)
      )
    )
  );
}

function TestBoolean(a, op, b) {
  return ast.BinaryExpression(
    op,
    a,
    b
  );
}

function Branch(expr, idT, idF) {
  return ast.IfStatement(
    expr,
    CallNode(idT),
    CallNode(idF)
  );
}

function ScopeObject() {
  return Identifier('scope');
}

function ScopeVariable(name) {
  return Member('scope', name);
}

function Value(val) {
  return ast.Literal(val);
}

function Identifier(name) {
  return ast.Identifier(name);
}

function Member(obj, prop) {
  return ast.MemberExpression(obj, prop);
}

function CallExpression(fn, args=[]) {
  return ast.CallExpression(fn, args);
}

function Assignment(a, b) {
  return ast.AssignmentExpression(
    a,
    '=',
    b
  );
}

export default {
  Assignment     : Assignment,
  Branch         : Branch,
  CallNode       : CallNode,
  CallExpression : CallExpression,
  FlowNode       : FlowNode,
  Identifier     : Identifier,
  Member         : Member,
  Program        : Program,
  ScopeVariable  : ScopeVariable,
  ScopeObject    : ScopeObject,
  TestBoolean    : TestBoolean,
  Value          : Value
};

