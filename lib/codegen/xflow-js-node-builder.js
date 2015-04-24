import LangUtil       from '../util/lang';
import ASTBuilder     from './ast-builder';

const ast    = ASTBuilder;
const exists = LangUtil.exists;

function nodeName(id) {
  return `node${id}`;
}

function Program(body=[], params=[], localvars=[], retvals=[]) {
  return ast.Program([
    ast.FunctionDeclaration(
      'main',    // id
      ['scope'], // params
      [].concat(
        localvars
      ).concat(
        body
      ).concat(
        [
          ast.ReturnStatement(
            ast.ExpressionStatement(
              ObjectExpression(retvals)
            )
          )
        ]
      )
    ),
    ast.ExpressionStatement(
      ast.CallExpression(
        Identifier('main'),
        ScopeObject()
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

function ObjectExpression(props=[]) {
  return ast.ObjectExpression(props);
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

function Property(key, value) {
  return ast.Property(key, value);
}

function Member(obj, prop) {
  return ast.MemberExpression(obj, prop);
}

function CallExpression(fn, args=[]) {
  return ast.CallExpression(fn, args);
}

function Assignment(a, b) {
  return ast.ExpressionStatement(
    ast.AssignmentExpression(
      a,
      '=',
      b
    )
  );
}

export default {
  Assignment       : Assignment,
  Branch           : Branch,
  CallNode         : CallNode,
  CallExpression   : CallExpression,
  FlowNode         : FlowNode,
  Identifier       : Identifier,
  Member           : Member,
  ObjectExpression : ObjectExpression,
  Program          : Program,
  Property         : Property,
  ScopeVariable    : ScopeVariable,
  ScopeObject      : ScopeObject,
  TestBoolean      : TestBoolean,
  Value            : Value
};

