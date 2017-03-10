import escodegen from 'escodegen';

import xfnode from './xflow-js-node-builder';
import XFlowStruct from '../xflow-struct';
import LangUtil from '../util/lang';
import Assert from '../util/assert';

const assertExists = Assert.exists;
const exists = LangUtil.exists;

const assertValidGenerator = (name, generator)=> {
  if (!LangUtil.isFunction(
    generator.generateFrom
  )) {
    throw new Error(
      `assertValidGenerator : Generator ${name} does not implement 'generateFrom' method`
    );
  }
};
class XFlowJSBuilder {

  constructor(json) {
    this.name = 'XFlowJSBuilder';
    this.xflow = new XFlowStruct(json);
    this.generators = {};
  }

  addGenerator(name, generator) {
    assertValidGenerator(name, generator);
    if (exists(this.generators[name])) {
      throw new Error(
        `${this.name}.addGenerator : a generator called '${name}' already exists`
      );
    }
    this.generators[name] = generator;
  }

  generateFlowNode(node) {

    const body = [];

    //
    // Add logic to node
    //

    if (exists(this.generators[node.nodetype])) {
      body.push(this.generators[node.nodetype].generateFrom(node));
    } else if (node.nodetype !== 'flow') {
      throw new Error(
        `XFlowJSBuilder.generateFlowNode : Unable to generate AST for node type '${node.nodetype}'`
      );
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
          branches[0].edge[1],
          branches[1].edge[1]
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
        ),
      ]
    );

    const paramChecks = this.xflow.getVariables().input.map(
      (el)=> {
        return xfnode.ThrowIfUndefined(
          xfnode.ScopeVariable(el.name),
          `Function called without variable scope.${el.name}`
        );
      }
    );

    const localVariables = this.xflow.getVariables().local.map(
      (el)=> {
        assertExists(el.value);
        return xfnode.Assignment(
          xfnode.ScopeVariable(el.name),
          xfnode.Value(el.value)
        );
      }
    );

    const returnValues = this.xflow.getVariables().output.map(
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

    let code;

    try {
      code = escodegen.generate(ret);
    } catch (e) {
      console.error('XFlowJSBuilder.generator : error generating code : ', e);
      throw new Error('XFlowJSBuilder.generator : error generating code ' + e.message);
    }

    return code;
  }

}

export default XFlowJSBuilder;
