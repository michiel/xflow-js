import xfnode from '../xflow-js-node-builder';
import LangUtil from '../../util/lang';
import FlowUtil from '../../util/flow';
import Assert from '../../util/assert';

import BaseGenerator from './base_generator';

function assertCallXFlowNode(node) {
  FlowUtil.assertIsNode(node);

  Assert.equal(node.nodetype, 'callxflow');
  Assert.equal(node.action, 'call');

  Assert.hasProperty(node, 'parameters.xflowid');

  Assert.hasProperty(node, 'parameters.inputmatch');
  Assert.isArray(node.parameters.inputmatch);

  Assert.hasProperty(node, 'parameters.outputmatch');
  Assert.isArray(node.parameters.outputmatch);

  Assert.equal(
    node.parameters.inputmatch.length,
    node.parameters.outputmatch.length
  );
}

class CallXFlowGenerator extends BaseGenerator {

  generateFrom(node) {

    assertCallXFlowNode(node);

    const body = [];

    //
    // Copy all the relevant variables into a new Object for passing to the called XFlow
    //

    body.push(
      xfnode.VariableDeclaration(
        'inputvars',
        xfnode.ObjectExpression()
      )
    );

    node.parameters.inputmatch.forEach(
      (match)=> {
        body.push(
          xfnode.Assignment(
            xfnode.Member('inputvars', match[1]),
            xfnode.ScopeVariable(match[0])
          )
        );
      }
    );

    body.push(

      xfnode.VariableDeclaration(
        'xflowres',
        xfnode.ObjectExpression([])
      ),

      //
      // Call the XFlow
      //

      xfnode.Assignment(
        xfnode.Identifier('xflowres'),
        xfnode.CallExpression(
          xfnode.Identifier('CallXFlow'),
          [
            xfnode.Value(node.parameters.xflowid),
            xfnode.Identifier('inputvars'),
          ]
        )
      )
    );

    //
    // Copy the results of the XFlow back into the scope object
    //

    node.parameters.outputmatch.forEach(
      (match)=> {
        body.push(
          xfnode.Assignment(
            xfnode.ScopeVariable(match[1]),
            xfnode.Member('xflowres', match[0])
          )
        );
      }
    );

    return xfnode.BlockStatement(body);
  }

}

export default CallXFlowGenerator;
