import XFlowDispatcherDynamic from '../../lib/xflow-dispatcher-dynamic';

import FlowActions   from '../../lib/actions/flow_actions';
import FloxActions   from '../../lib/actions/flox_actions';
import ObjectActions from '../../lib/actions/object_actions';

function getXFlowDispatcherBasic() {
  return new XFlowDispatcherDynamic({
    'flox' : {
      'name'      : 'flox',
      'version'   : 1,
      'dispatch'  : FloxActions.Dispatch,
      'dispatchQ' : FloxActions.DispatchQ
    },
    'object' : {
      'name'      : 'object',
      'version'   : 1,
      'dispatch'  : ObjectActions.Dispatch,
      'dispatchQ' : ObjectActions.DispatchQ
    },
    'flow' : {
      'name'      : 'flow',
      'version'   : 1,
      'dispatch'  : FlowActions.Dispatch,
      'dispatchQ' : FlowActions.DispatchQ
    }
  });
}

function getXFlowDispatcherExt(args={}) {
  let setup = {
    'flox' : {
      'name'      : 'flox',
      'version'   : 1,
      'dispatch'  : FloxActions.Dispatch,
      'dispatchQ' : FloxActions.DispatchQ
    },
    'object' : {
      'name'      : 'object',
      'version'   : 1,
      'dispatch'  : ObjectActions.Dispatch,
      'dispatchQ' : ObjectActions.DispatchQ
    },
    'flow' : {
      'name'      : 'flow',
      'version'   : 1,
      'dispatch'  : FlowActions.Dispatch,
      'dispatchQ' : FlowActions.DispatchQ
    }
  };

  for (let name in args) {
    setup[name] = args[name];
  }

  return new XFlowDispatcherDynamic(setup);
}

export default {
  getXFlowDispatcherBasic : getXFlowDispatcherBasic,
  getXFlowDispatcherExt   : getXFlowDispatcherExt
};

