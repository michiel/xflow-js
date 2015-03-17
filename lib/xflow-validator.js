import RSVP from 'rsvp';
import TV4  from 'tv4';

import FlowUtil from './util/flow';
import LangUtil from './util/lang';
import Flox     from './flox';

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
    res = getEntryNode(flow.nodes);
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

function isSchemaValid(flow, schema) {
  const res = TV4.validate(flow, schema);
//   if (res === false) {
//     console.log('XFlowValidator.isSchemaValid validation error ', TV4.error);
//   }
  return res;
}

class XFlowValidator {
  constructor(flowJson, schemaJson) {

    if (!exists(flowJson)) {
      throw new Error('XFlowValidator : No valid flow data found');
    }

    if (!exists(schemaJson)) {
      throw new Error('XFlowValidator : No schema passed');
    }

    this.flow   = flowJson;
    this.schema = schemaJson;
  }

  validate() {
    if (!isSchemaValid(this.flow, this.schema)) {
      return false;
    } else {
      const res = [
        allBranchesHaveNodes(this.flow),
        hasOneEntryNode(this.flow),
        hasTerminalNodes(this.flow),
        expressionsReferenceKnownVariables(this.flow)
      ];

      return (res.filter((x)=> !x)).length === 0;
    }
  }

}

export default XFlowValidator;
