import RSVP from 'rsvp';
import TV4 from 'tv4';

import flowUtil from './flow-util';

function exists(val) {
  return (
    (val !== null) &&
    (val !== undefined)
  );
}

function getNode(id, nodes) {
  var resNodes = nodes.filter(
    (node) =>
      node.id === id
  );

  if (resNodes.length !== 1) {
    if (resNodes.length > 1) {
      throw new Error('Multiple nodes with ID found : ' + id);
    }
    if (resNodes.length < 1) {
      throw new Error('No node with ID found : ' + id);
    }
  }

  return resNodes[0];
}

const exists       = flowUtil.exists;
const getNode      = flowUtil.getNode;
const getEntryNode = flowUtil.getEntryNode;

function allBranchesHaveNodes(flow) {
  var branches = flow.branches || []; // XXX This should be caught by schema validation!
  var res = branches.filter(
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
  var res = true;
  try {
    res = getEntryNode(flow.nodes);
  } catch (e) {
    res = false;
  }
  return res;
}

class xflowValidator {
  constructor(flowJson, schemaJson) {

    if (!!!flowJson.data) {
      throw new Error('xflowExecutor : No valid flow data found');
    }

    if (!!!schemaJson) {
      throw new Error('xflowExecutor : No schema passed');
    }

    this.flow   = flowJson.data;
    this.schema = schemaJson;
  }

  validate() {
    var res = [
      allBranchesHaveNodes(this.flow),
      hasOneEntryNode(this.flow),
      TV4.validate(this.flow, this.schema)
    ];

    return (res.filter((x)=> !x)).length === 0;
  }

}

export default xflowValidator;
