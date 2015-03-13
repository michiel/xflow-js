import RSVP from 'rsvp';
import TV4 from 'tv4';

import flowUtil from './flow-util';

const exists       = flowUtil.exists;
const getNode      = flowUtil.getNode;
const getEntryNode = flowUtil.getEntryNode;
const getNodeType  = flowUtil.getNodeType;
const mergeDict    = flowUtil.mergeDict;

function allBranchesHaveNodes(flow) {
  const branches = flow.branches || []; // XXX This should be caught by schema validation!
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

  const expressions = getNodeType(flow.nodes, 'flox').map(
    (node) => node.parameters.expression
  );

  expressions.forEach(
    (expr)=> {
      const refs = (expr.match(/(\$[\w\.]*)/g) || []);
      refs.forEach((ref)=> {
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
    const res = [
      allBranchesHaveNodes(this.flow),
      hasOneEntryNode(this.flow),
      hasTerminalNodes(this.flow),
      expressionsReferenceKnownVariables(this.flow),
      TV4.validate(this.flow, this.schema)
    ];

    return (res.filter((x)=> !x)).length === 0;
  }

}

export default XFlowValidator;
