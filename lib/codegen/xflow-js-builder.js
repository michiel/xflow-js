import escodegen      from 'escodegen';

import xfnode      from './xflow-js-node-builder';
import XFlowStruct from '../xflow-struct';
import LangUtil    from '../util/lang';
import Assert      from '../util/assert';

const exists         = LangUtil.exists;

function builderFloxEval(node) {
  return xfnode.Assignment(
    xfnode.ScopeVariable(node.parameters.returns.name),
    xfnode.CallExpression(
      xfnode.Member('Flox', 'evalexpr'),
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
      (node.action   === 'evalexpr')
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

      Assert.length(branches, 2);

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

  generate() {
    const bodyNodes = [].concat(
      this.generateFlowNodes(),
      [
        xfnode.CallNode(
          this.xflow.getEntryNode().id
        )
      ]
    );

    const paramChecks = this.xflow.getVariables().in.map(
      (el)=> {
        return xfnode.ThrowIfUndefined(
          xfnode.ScopeVariable(el.name),
          `Function called without variable scope.${el.name}`
        );
      }
    );

    const localVariables = this.xflow.getVariables().local.map(
      (el)=> {
        return xfnode.Assignment(
          xfnode.ScopeVariable(el.name),
          xfnode.Value(
            exists(el.value) ?
              el.value :
              0 // XXX : use defaultForType builder or hard require flow to specify default
          )
        );
      }
    );

    const returnValues = this.xflow.getVariables().out.map(
      (el)=> {
        return xfnode.Property(
          xfnode.Identifier(el.name),
          xfnode.ScopeVariable(el.name)
        );
      }
    );

    const ret = xfnode.Program(
      bodyNodes,      // body
      paramChecks,    // params ['x', 'y']
      localVariables, // local variables ['z']
      returnValues    // return values ['x', 'z']
    );

    // console.log('AST', JSON.stringify(ret, null, '  '));
    // console.log('AST2CODE :\n ' + escodegen.generate(ret));

    return escodegen.generate(ret);
  }

}

export default XFlowJSBuilder;
