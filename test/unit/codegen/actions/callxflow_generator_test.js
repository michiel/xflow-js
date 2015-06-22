import chai           from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs             from 'fs';
import vm             from 'vm';

chai.use(chaiAsPromised);

// import XFlow           from '../../../../lib/xflow';
// import XFlowDispatcher from '../../../../lib/xflow-dispatcher';
import XFlowJSBuilder  from '../../../../lib/codegen/xflow-js-builder';

// import Flox                 from '../../../lib/flox';

import FloxGenerator        from '../../../../lib/codegen/actions/flox_generator';
import CallXFlowGenerator   from '../../../../lib/codegen/actions/callxflow_generator';

// function getXFlow(json, params) {
//   var dispatcher = new XFlowDispatcher();
//   return new XFlow(json, params, dispatcher);
// }

function buildScript(json) {
  var builder = new XFlowJSBuilder(json);

  builder.addGenerator('flox', new FloxGenerator());
  builder.addGenerator('callxflow', new CallXFlowGenerator());

  var jscode   = builder.generate();
  // console.log('JSCODE ', jscode);
  return new vm.Script(jscode, {
    displayErrors : true
  });
}

// function getEnv(skoop) {
//   return {
//     scope : skoop || {},
//     Flox  : {
//       'evalexpr' : function(exp, scope) {
//         // console.log('EXP ', exp, 'SCOPE ', scope);
//         var str = Flox.substituteExpression(exp, scope);
//         return Flox.parse(str);
//       }
//     },
//     CallXFlow : function(scope) {
//       console.log('CallXFlow called with ', scope);
//       return scope;
//     }
//   };
// }

function loadJson(path) {
  var data = fs.readFileSync(path, 'utf-8');
  return JSON.parse(data);
}

describe('CallXFlow AST Generator', function() {

  it('loads a json flow and compiles to JS', function() {

    var json = loadJson('data/capability_flows/xflow-call-xflow.json');

    var script   = buildScript(json);
    script = script; // jshint

//     var ctxt     = vm.createContext(getEnv({
//       'ValueA' : 4,
//       'ValueB' : 5
//     }));
//     var vmResult = script.runInNewContext(ctxt);
//     expect(vmResult).to.deep.equal({
//       'ReturnValue' : 9
//     });

  });

});


