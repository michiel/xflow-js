import RSVP from 'rsvp';
import TV4 from 'tv4';

import flowUtil from './flow-util';

const exists       = flowUtil.exists;
const getNode      = flowUtil.getNode;
const getEntryNode = flowUtil.getEntryNode;

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

class xflowValidator {
  constructor(flowJson, schemaJson) {

    if (!!!flowJson) {
      throw new Error('xflowExecutor : No valid flow data found');
    }

    if (!!!schemaJson) {
      throw new Error('xflowExecutor : No schema passed');
    }

    this.flow   = flowJson;
    this.schema = schemaJson;
  }

  validate() {
    const res = [
      allBranchesHaveNodes(this.flow),
      hasOneEntryNode(this.flow),
      TV4.validate(this.flow, this.schema)
    ];

    return (res.filter((x)=> !x)).length === 0;
  }

}

export default xflowValidator;
