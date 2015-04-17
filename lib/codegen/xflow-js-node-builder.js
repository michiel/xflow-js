import LangUtil       from '../util/lang';
import ASTBuilder     from './ast-builder';

const ast    = ASTBuilder;
const exists = LangUtil.exists;

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

function FlowNode(id) {
  return ast.FunctionDeclaration(
    'node' + id, // id
    [],          // params
    [
      ast.EmptyStatement()
    ]
  );
}

export default {
  Program   : Program,
  FlowNode  : FlowNode
};

