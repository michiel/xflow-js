import escodegen      from 'escodegen';

import ASTBuilder     from './ast-builder';
import XFlowValidator from '../xflow-validator';
import LangUtil       from '../util/lang';

const exists         = LangUtil.exists;
const ast            = ASTBuilder;

class XFlowJSBuilder {

  constructor(json) {
  }

  generate() {
    var ret = ast.Program([
      ast.FunctionDeclaration('main', [],
        [
          ast.ReturnStatement(
            ast.ExpressionStatement(
              ast.ArrayExpression([
                ast.ObjectExpression()
              ])
            )
          )
        ]
      ),
      ast.ExpressionStatement(
        ast.CallExpression('main')
      )
    ]);

    // console.log('AST', JSON.stringify(ret, null, '  '));
    // console.log('AST2CODE : ' + escodegen.generate(ret));

    return escodegen.generate(ret);
  }

}

export default XFlowJSBuilder;
