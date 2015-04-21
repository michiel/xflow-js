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
        'main',
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
    ast.CallExpression(nodeName(id))
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

function ScopeVariable(name) {
  return ast.MemberExpression('scope', name);
}

function Value(val) {
  return ast.Literal(val);
}

export default {
  Branch        : Branch,
  CallNode      : CallNode,
  FlowNode      : FlowNode,
  Program       : Program,
  ScopeVariable : ScopeVariable,
  TestBoolean   : TestBoolean,
  Value         : Value
};

