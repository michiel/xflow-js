import XFlowStruct from './xflow-struct';

import FlowUtil    from './util/flow';

function cyclomaticCC(xflow) {
  const edges         = xflow.getEdges();
  const nodes         = xflow.getNodes();
  const terminalNodes = FlowUtil.getNodeType(nodes, 'flow', 'end');

  return edges.length - nodes.length + terminalNodes.length;
}

class XFlowMetrics {

  constructor() {
    this.name = 'XFlowMetrics';
  }

  report(xflow) {
    if (!(xflow instanceof XFlowStruct)) {
      throw new Error(
        `${this.name}.report: xflow in not an instance of XFlowStruct`
      );
    }

    return {
      ccc : cyclomaticCC(xflow)
    };

  }
}

export default XFlowMetrics;
