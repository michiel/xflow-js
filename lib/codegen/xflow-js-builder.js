import escodegen      from 'escodegen';

import ast         from './ast-builder';
import xfnode      from './xflow-js-node-builder';
import XFlowStruct from '../xflow-struct';
import LangUtil    from '../util/lang';

const exists         = LangUtil.exists;

class XFlowJSBuilder {

  constructor(json) {
    this.json = json;
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

  generateFlowNode(node) {
    return xfnode.FlowNode(node.id);
  }

  generateFlowNodes() {
    return this.json.nodes.map((node)=> {
      return this.generateFlowNode(node);
    });
  }

  generateX() {

    const ret = xfnode.Program(
      this.generateFlowNodes()
    );

    // console.log('AST', JSON.stringify(ret, null, '  '));
    // console.log('AST2CODE : ' + escodegen.generate(ret));

    return escodegen.generate(ret);
  }

}

export default XFlowJSBuilder;
