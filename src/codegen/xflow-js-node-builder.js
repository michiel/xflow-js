import LangUtil       from '../util/lang';
import ASTBuilder     from './ast-builder';

const ast    = ASTBuilder;
const exists = LangUtil.exists;

const nodeName = (id)=> {
  return `node${id}`;
}

const Program = (body=[], paramChecks=[], localvars=[], retvals=[])=> {
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

const FlowNode = (id, body=[])=> {

  if (body.length === 0) {
    body.push(ast.EmptyStatement());
  }

  return ast.FunctionDeclaration(
    nodeName(id), // id
    [],           // params
    body
  );
}

const CallNode = (id)=> {
  return ast.ExpressionStatement(
    ast.CallExpression(
      Identifier(
        nodeName(id)
      )
    )
  );
}

const TestBoolean = (a, op, b)=> {
  return ast.BinaryExpression(
    op,
    a,
    b
  );
}

const BlockStatement = (body=[])=> {
  return ast.BlockStatement(body);
}

const Branch = (expr, idT, idF)=> {
  return ast.IfStatement(
    expr,
    CallNode(idT),
    CallNode(idF)
  );
}

const ObjectExpression = (props=[])=> {
  return ast.ObjectExpression(props);
}

const ScopeObject = ()=> {
  return Identifier('scope');
}

const ScopeVariable = (name)=> {
  return Member('scope', name);
}

const Value = (val)=> {
  return ast.Literal(val);
}

const Identifier = (name)=> {
  return ast.Identifier(name);
}

const ThrowIfUndefined = (ident, err)=> {
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

const Property = (key, value)=> {
  return ast.Property(key, value);
}

const Member = (obj, prop)=> {
  return ast.MemberExpression(obj, prop);
}

const CallExpression = (fn, args=[])=> {
  return ast.CallExpression(fn, args);
}

const Assignment = (a, b)=> {
  return ast.ExpressionStatement(
    ast.AssignmentExpression(
      a,
      '=',
      b
    )
  );
}

const VariableDeclaration = (varname, varinit)=> {
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

