import escodegen      from 'escodegen';

import xfnode      from './xflow-js-node-builder';
import XFlowStruct from '../xflow-struct';
import LangUtil    from '../util/lang';

const exists         = LangUtil.exists;

function builderFloxEval(node) {
  return xfnode.Assignment(
    xfnode.ScopeVariable(node.parameters.returns.name),
    xfnode.CallExpression(
      xfnode.Member('Flox', 'eval'),
      [
        xfnode.Value(node.parameters.expression),
        xfnode.ScopeObject()
      ]
    )
  );
}

class XFlowJSBuilder {

  constructor(json) {
    this.xflow = new XFlowStruct(json);
  }

  generateFlowNode(node) {

    let body = [];

    //
    // Add logic to node
    //

    if (
      (node.nodetype === 'flox') &&
      (node.action   === 'eval')
    ) {
      body.push(builderFloxEval(node));
    }

    //
    // Branch or call next node
    //

    if (this.xflow.isBranchNode(node)) {

      const paramName = node.parameters.name;

      const branches = this.xflow.getOutEdges(node).map(
        (edge) => {
          return this.xflow.getBranchesFor(edge)[0];
        }
      );

      body.push(
        xfnode.Branch(
          xfnode.TestBoolean(
            xfnode.ScopeVariable(node.parameters.name), // scope var
            '===',                                      // operator
            xfnode.Value(branches[0].value)             // literal
          ),
          branches[0].branch[1],
          branches[1].branch[1]
        )
      );
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

    // console.log('AST', JSON.stringify(ret, null, '  '));
    // console.log('AST2CODE :\n ' + escodegen.generate(ret));

    return escodegen.generate(ret);
  }

  generate() {
    return this.generateX();
  }

}

export default XFlowJSBuilder;
