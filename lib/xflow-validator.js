import RSVP from 'rsvp';
import tv4  from 'tv4';

import FlowUtil from './util/flow';
import LangUtil from './util/lang';
import Flox     from './flox';

import FlowV1Schema from '../data/schemas/xflow-schema';

const exists       = LangUtil.exists;
const mergeDict    = LangUtil.mergeDict;
const getNode      = FlowUtil.getNode;
const getEntryNode = FlowUtil.getEntryNode;
const getNodeType  = FlowUtil.getNodeType;

const expressionRE = Flox.expressionRE;
const whitespaceRE = Flox.whitespaceRE;

function allBranchesHaveNodes(flow) {
  const branches = flow.branches;
  const res = branches.filter(
    (branch) => {
      return (
        exists(getNode(branch.branch[0], flow.nodes)) &&
        exists(getNode(branch.branch[1], flow.nodes))
      );
    }
  );
  return (res.length === branches.length);
}

function hasOneEntryNode(flow) {
  let res = true;
  try {
    res = !!getEntryNode(flow.nodes);
  } catch (e) {
    res = false;
  }
  return res;
}

function hasTerminalNodes(flow) {
  const termNodes = getNodeType(flow.nodes, 'flow', 'end');
  return (termNodes.length !== 0);
}

function expressionsReferenceKnownVariables(flow) {
  let flowVars      = {};
  let unMatchedVars = [];

  const getVar = (el)=> { flowVars[el.name] = false; };

  flow.signature.in.forEach(getVar);
  flow.variables.forEach(getVar);

  const expressions = getNodeType(flow.nodes, 'flow', 'flox').map(
    (node) => node.parameters.expression
  );

  expressions.forEach(
    (expr)=> {
      const refs = (expr.replace(whitespaceRE, '').match(expressionRE) || []);
      refs.forEach((ref)=> {
        ref = ref.slice(1, ref.length); // Remove '$'
        if (exists(flowVars[ref])) {
          flowVars[ref] = true;
        } else {
          unMatchedVars.push(ref);
        }
      });
    }
  );

  return (unMatchedVars.length === 0);
}

function allNodeActionsHaveMatchingRequirements(flow) {
  return flow.nodes.filter((node)=> {
    return flow.requirements.filter((req)=> {
      return req.xtype === node.nodetype;
    }).length !== 1;
  }).length === 0;
}

function isSchemaValid(flow, schema) {
  const res = tv4.validate(flow, schema);
//   if (res === false) {
//     console.log('XFlowValidator.isSchemaValid validation error ', tv4.error);
//   }
  return res;
}

function allReturnValuesExist(flow) {
  const getName = (el) => el.name;
  const retvars = flow.signature.out.map(getName);
  const ovars   = flow.signature.in.map(getName).concat(
    flow.variables.map(getName)
  );
  return retvars.filter((el)=> {
    return ovars.indexOf(el) > -1;
  });
}

/**
 * XFlowValidator - validates flow structure and content
 * @class XFlowValidator
 */
class XFlowValidator {
  constructor() {
    this.schema = FlowV1Schema;
  }

  /**
   * Supply a valid JSON flow and it returns a Boolean representing validity
   * @method validate
   * @param {Object} flow JSON flow
   * @return {Boolean}
   */
  validate(flow) {

    if (!exists(flow)) {
      throw new Error('XFlowValidator : No valid flow data found');
    }

    if (!isSchemaValid(flow, this.schema)) {
      return false;
    } else {

      const res = [
        allBranchesHaveNodes(flow),
        hasOneEntryNode(flow),
        hasTerminalNodes(flow),
        allNodeActionsHaveMatchingRequirements(flow),
        expressionsReferenceKnownVariables(flow),
        allReturnValuesExist(flow)
      ];

      return (res.filter((x)=> !x)).length === 0;
    }
  }

}

export default XFlowValidator;
