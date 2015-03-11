import XFlowDispatcher from './xflow-dispatcher';
import XFlowFactory    from './xflow-factory';
import XFlowRunner     from './xflow-runner';

function getXFlowFactory() {
  return (new XFlowFactory(
    new XFlowDispatcher()
  ));
}

function getXFlowRunner() {
  return (new XFlowRunner(
    getXFlowFactory()
  ));
}

export default {
  getXFlowRunner : getXFlowRunner
};
