import tv4 from 'tv4';

import {
  getNodeType,
} from './util/flow';

import {
  exists,
  isArray,
} from './util/lang';

import {
  expressionRE,
  whitespaceRE,
} from './flox';

import FlowV1Schema from '../data/schemas/xflow-schema';

const nodeDesc = (node)=> {
  return `node-${node.id}:[${node.label || 'unlabeled'}]`;
};

const validationError = (code, message, path = [])=> {
  return {
    code,
    message,
    paths: isArray(path) ? path : [path],
  };
};

const allEdgesHaveNodes = (flow)=> {
  const errors = [];

  flow.edges.forEach(
    (edge) => {
      edge.forEach((id)=> {
        const nodes = flow.nodes.filter(
          (node)=>
            node.id === id
        );
        if (nodes.length === 0) {
          errors.push(validationError(
            0,
            `Edge [${edge}] has no connecting node ${id}`,
            `/edges/${edge}`
          ));
        }
      });
    }
  );
  return errors;
};

const allNodesHaveAtLeastOneEdge = (flow)=> {
  const errors = [];

  flow.nodes.forEach(
    (node)=> {
      const id = node.id;
      const res = flow.edges.filter(
        (edge)=> {
          return (
            (edge[0] === id) ||
              (edge[1] === id)
          );
        }
      );
      if (res.length === 0) {
        errors.push(validationError(
          0,
          `Orphan node ${id} is unreachable`,
          `/nodes/${id}`
        ));
      }
    }
  );

  return errors;
};

const hasOneEntryNode = (flow)=> {
  const errors = [];
  const entryNodes = getNodeType(flow.nodes, 'flow', 'start');
  if (entryNodes.length === 0) {
    errors.push(validationError(
      0,
      'Flow has no entry node',
      '/nodes'
    ));
  } else if (entryNodes.length > 1) {
    errors.push(validationError(
      0,
      'Flow has multiple entry nodes',
      entryNodes.map(
        (node)=>
          `/nodes/${node.id}`
      )
    ));
  }

  return errors;
};

const hasTerminalNodes = (flow)=> {
  const termNodes = getNodeType(flow.nodes, 'flow', 'end');
  const errors = [];
  if (termNodes.length === 0) {
    errors.push(validationError(
      0,
      'Flow has no terminal node',
      '/nodes'
    ));
  }
  return errors;
};

const expressionsReferenceKnownVariables = (flow)=> {
  const errors = [];
  const flowVars = {};

  const getVar = (el)=> { flowVars[el.name] = false; };

  flow.variables.input.forEach(getVar);
  flow.variables.local.forEach(getVar);

  const nodes = getNodeType(flow.nodes, 'flox', 'evalexpr');

  nodes.forEach(
    (node)=> {
      const expr = node.parameters.expression;
      const refs = (expr.replace(whitespaceRE, '').match(expressionRE) || []);
      refs.forEach((ref)=> {
        ref = ref.slice(1, ref.length); // Remove '$'
        if (exists(flowVars[ref])) {
          flowVars[ref] = true;
        } else {
          errors.push(
            validationError(
              0,
              `Expression '${expr}' references unknown variable '${ref}' in ${nodeDesc(node)}`,
              `/nodes/${node.id}/parameters/expression`
            )
          );
        }
      });
    }
  );

  return errors;
};

const allNodeActionsHaveMatchingRequirements = (flow)=> {
  const errors = [];
  flow.nodes.forEach(
    (node)=> {
      const res = flow.requirements.filter(
        (req)=> {
          return req.xtype === node.nodetype;
        }
      );
      if (res.length !== 1) {
        errors.push(validationError(
          0,
          `${nodeDesc(node)} uses an unavailable capability '${node.nodetype}'`,
          `/nodes/${node.id}`
        ));
      }
    }
  );
  return errors;
};

const isSchemaValid = (flow, schema)=> {
  const res = tv4.validate(flow, schema);
//   if (res === false) {
//     console.log('XFlowValidator.isSchemaValid validation error ', tv4.error);
//   }
  return res;
};

const allReturnValuesExist = (flow)=> {
  const errors = [];

  const getName = (el) => el.name;
  const retvars = flow.variables.output.map(getName);
  const ovars = flow.variables.input.map(getName).concat(
    flow.variables.local.map(getName)
  );

  retvars.forEach(
    (el)=> {
      if (ovars.indexOf(el) < 0) {
        errors.push(validationError(
          0,
          `Return value ${el} does not appear in scope`,
          `/variables/output/${el}`
        ));
      }
    }
  );

  return errors;
};

const variablesAreDefinedOnlyOnce = (flow)=> {
  const errors = [];

  const getName = (el) => el.name;
  const inVars = flow.variables.input.map(getName);
  const localVars = flow.variables.local.map(getName);

  inVars.forEach((inV)=> {
    if (localVars.indexOf(inV) > -1) {
      errors.push(validationError(
        0,
        `Input variable ${inV} is redefined in local variables`,
        `/variables/input/${inV}`
      ));
    }
  });

  return errors;
};

//
// XXX: Variables should be unique per scope is a schema requirement
//

const variablesAreUniquePerScope = (flow)=> {
  const errors = [];

  const getName = (el) => el.name;
  ['input', 'output', 'local'].forEach(
    (scope)=> {
      const varCount = {};
      const scVars = flow.variables[scope].map(getName);
      scVars.forEach(
        (name)=> {
          if (!exists(varCount[name])) {
            varCount[name] = 1;
          } else {
            varCount[name]++;
          }
        }
      );
      for (const name in varCount) {
        if (varCount[name] > 1) {
          errors.push(validationError(
            0,
            `Variable ${name} is defined ${varCount[name]} times in ${scope} variables`,
            `/variables/${scope}/${name}`
          ));
        }
      }
    }
  );
  return errors;
};

/**
 * XFlowValidator - validates flow structure and content
 * @class XFlowValidator
 */
class XFlowValidator {

  /**
   * XFlowValidator constructor
   * @class XFlowValidator
   * @constructor XFlowValidator
   */
  constructor() {
    this.schema = FlowV1Schema;
  }

  /**
   * Supply a JSON flow and it returns a Boolean representing schema conformity
   * @method validateSchema
   * @param {Object} flow JSON flow
   * @return {Boolean}
   */
  validateSchema(flow) {
    return isSchemaValid(flow, this.schema);
  }

  /**
   * Supply a JSON flow and it returns an Array with schema errors
   * @method validateSchemaWithErrors
   * @param {Object} flow JSON flow
   * @return {Array}
   */
  validateSchemaWithErrors(flow) {
    return tv4.validateMultiple(flow, this.schema).errors.map((err)=> {
      return validationError(
        0,
        `Invalid schema : ${err.message}`,
        err.dataPath
      );
    });
  }

  /**
   * Supply a valid JSON flow and it returns a Boolean representing validity
   * @method validate
   * @param {Object} flow JSON flow
   * @return {Boolean}
   */
  validate(flow) {

    if (!exists(flow)) {
      throw new Error('XFlowValidator : No valid flow data found');
    }

    if (!this.validateSchema(flow)) {
      return false;
    } else {

      const res = [
        allEdgesHaveNodes(flow).length === 0,
        hasOneEntryNode(flow).length === 0,
        hasTerminalNodes(flow).length === 0,
        allNodeActionsHaveMatchingRequirements(flow).length === 0,
        expressionsReferenceKnownVariables(flow).length === 0,
        allReturnValuesExist(flow).length === 0,
        variablesAreDefinedOnlyOnce(flow).length === 0,
        variablesAreUniquePerScope(flow).length === 0,
        allNodesHaveAtLeastOneEdge(flow).length === 0,
      ];

      return (res.filter((x)=> !x)).length === 0;
    }
  }

  /**
   * Supply a valid JSON flow and it returns an Array with errors
   * @method validateWithErrors
   * @param {Object} flow JSON flow
   * @return {Array} Errors
   */
  validateWithErrors(flow) {
    if (!exists(flow)) {
      throw new Error('XFlowValidator : No valid flow data found');
    }

    if (!this.validateSchema(flow)) {
      return this.validateSchemaWithErrors(flow);
    } else {

      return [].concat(
        allEdgesHaveNodes(flow),
        hasOneEntryNode(flow),
        hasTerminalNodes(flow),
        allNodeActionsHaveMatchingRequirements(flow),
        expressionsReferenceKnownVariables(flow),
        allReturnValuesExist(flow),
        variablesAreDefinedOnlyOnce(flow),
        // variablesAreUniquePerScope(flow),
        allNodesHaveAtLeastOneEdge(flow)
      );

    }

  }

}

export default XFlowValidator;
