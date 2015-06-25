import LangUtil       from '../util/lang';
import ASTBuilder     from './ast-builder';

const ast    = ASTBuilder;
const exists = LangUtil.exists;

function nodeName(id) {
  return `node${id}`;
}

function Program(body=[], paramChecks=[], localvars=[], retvals=[]) {
  return ast.Program([
    ast.FunctionDeclaration(
      'main',    // id
      ['scope'], // params
      [].concat(
        paramChecks,
        localvars,
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

function BlockStatement(body=[]) {
  return ast.BlockStatement(body);
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

function ThrowIfUndefined(ident, err) {
  return ast.IfStatement(
    TestBoolean(
      ident,
      '===',
      ast.Identifier('undefined')
    ),
    ast.ThrowStatement(
      ast.NewExpression(
        ast.Identifier('Error'),
        ast.Literal(err)
      )
    )
  );
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

function VariableDeclaration(varname, varinit) {
  return ast.VariableDeclarator(varname, varinit);
}

export default {
  Assignment          : Assignment,
  BlockStatement      : BlockStatement,
  Branch              : Branch,
  CallNode            : CallNode,
  CallExpression      : CallExpression,
  FlowNode            : FlowNode,
  Identifier          : Identifier,
  Member              : Member,
  ObjectExpression    : ObjectExpression,
  Program             : Program,
  Property            : Property,
  ScopeVariable       : ScopeVariable,
  ScopeObject         : ScopeObject,
  TestBoolean         : TestBoolean,
  ThrowIfUndefined    : ThrowIfUndefined,
  Value               : Value,
  VariableDeclaration : VariableDeclaration
};

