import XFlow from './xflow';
import XFlowStruct from './xflow-struct';
import XFlowMutableStruct from './xflow-mutable-struct';
import XFlowDispatcher from './xflow-dispatcher';
import XFlowFactory from './xflow-factory';
import XFlowValidator from './xflow-validator';
import XFlowRunner from './xflow-runner';
import XFlowHarness from './xflow-harness';
import XFlowMetrics from './xflow-metrics';

import XFlowJSBuilder from './codegen/xflow-js-builder';
import CallXFlowASTGenerator from './codegen/actions/callxflow_generator';
import FloxASTGenerator from './codegen/actions/flox_generator';

export default {
  XFlow: XFlow,
  XFlowStruct: XFlowStruct,
  XFlowMutableStruct: XFlowMutableStruct,
  XFlowDispatcher: XFlowDispatcher,
  XFlowFactory: XFlowFactory,
  XFlowRunner: XFlowRunner,
  XFlowHarness: XFlowHarness,
  XFlowValidator: XFlowValidator,
  XFlowMetrics: XFlowMetrics,
  CodeGen: {
    XFlowJSBuilder: XFlowJSBuilder,
    Generators: {
      CallXFlowASTGenerator: CallXFlowASTGenerator,
      FloxASTGenerator: FloxASTGenerator,
    },
  },
};
