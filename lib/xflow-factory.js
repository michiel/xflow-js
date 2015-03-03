import XFlow from './xflow';

class XFlowFactory {

  constructor(disp) {
    this.dispatcher = disp;
  }

  buildFlow(flowData, params) {
    return new XFlow(flowData, params, this.dispatcher);
  }

  run(flowData, params={}) {
    const flow = this.buildFlow(flowData, params);
    return flow.start();
  }

  runQ(flowData, params={}) {
    const flow = this.buildFlow(flowData, params);
    return flow.startQ();
  }

}

export default XFlowFactory;
