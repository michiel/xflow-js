import XFlow              from './xflow';
import XFlowStruct        from './xflow-struct';
import XFlowMutableStruct from './xflow-mutable-struct';
import XFlowDispatcher    from './xflow-dispatcher';
import XFlowFactory       from './xflow-factory';
import XFlowValidator     from './xflow-validator';
import XFlowRunner        from './xflow-runner';

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
  XFlow              : XFlow,
  XFlowStruct        : XFlowStruct,
  XFlowMutableStruct : XFlowMutableStruct,
  XFlowDispatcher    : XFlowDispatcher,
  XFlowFactory       : XFlowFactory,
  XFlowValidator     : XFlowValidator,
  getXFlowRunner     : getXFlowRunner
};
