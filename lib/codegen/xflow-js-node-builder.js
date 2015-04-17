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
      'main', // id
      [],     // params
      body.concat(
        [
          ast.ReturnStatement(
            ast.ExpressionStatement(
              ast.ArrayExpression([
                ast.ObjectExpression()
              ])
            )
          )
        ]
      )
    ),
    ast.ExpressionStatement(
      ast.CallExpression('main')
    )
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

export default {
  Program   : Program,
  CallNode  : CallNode,
  FlowNode  : FlowNode
};

