import escodegen      from 'escodegen';

import ast         from './ast-builder';
import xfnode      from './xflow-js-node-builder';
import XFlowStruct from '../xflow-struct';
import LangUtil    from '../util/lang';

const exists         = LangUtil.exists;

class XFlowJSBuilder {

  constructor(json) {
    this.xflow = new XFlowStruct(json);
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

    let body = [];

    //
    // Add logic to node
    //

    //
    // Branch or call next node
    //

    if (this.xflow.isBranch(node)) {
      throw new Error('UNHANDLED BRANCH');
    } else if (!this.xflow.isTerminalNode(node)) {
      body.push(
        xfnode.CallNode(
          this.xflow.getNextNode(node).id
        )
      );
    }
    return xfnode.FlowNode(node.id, body);
  }

  generateFlowNodes() {
    return this.xflow.json.nodes.map((node)=> {
      return this.generateFlowNode(node);
    });
  }

  generateX() {

    const ret = xfnode.Program(
      this.generateFlowNodes()
    );

    console.log('AST', JSON.stringify(ret, null, '  '));
    console.log('AST2CODE : ' + escodegen.generate(ret));

    return escodegen.generate(ret);
  }

}

export default XFlowJSBuilder;
