import xfnode      from '../xflow-js-node-builder';
import LangUtil    from '../../util/lang';
import FlowUtil    from '../../util/flow';
import Assert      from '../../util/assert';

class FloxGenerator {

  generateFrom(node) {

    FlowUtil.assertIsNode(node);

    Assert.equal(node.nodetype, 'flox');
    Assert.equal(node.action, 'evalexpr');

    Assert.hasProperty(node, 'parameters.returns.name');
    Assert.hasProperty(node, 'parameters.expression');

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

}

export default FloxGenerator;
