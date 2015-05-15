import RSVP from 'rsvp';
import tv4  from 'tv4';

import FlowUtil from './util/flow';
import LangUtil from './util/lang';
import Flox     from './flox';

import FlowV1Schema from '../data/schemas/xflow-schema';

const exists       = LangUtil.exists;
const mergeDict    = LangUtil.mergeDict;
const isArray      = LangUtil.isArray;
const getEntryNode = FlowUtil.getEntryNode;
const getNodeType  = FlowUtil.getNodeType;

const expressionRE = Flox.expressionRE;
const whitespaceRE = Flox.whitespaceRE;

function validationError(code, message, path=[]) {
  return {
    code    : code,
    message : message,
    paths   : isArray(path) ? path : [path]
  };
}

function allEdgesHaveNodes(flow) {
  let errors     = [];

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
}

function allNodesHaveAtLeastOneEdge(flow) {
  let errors = [];

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
}

function hasOneEntryNode(flow) {
  let res    = true;
  let errors = [];
  const entryNodes = getNodeType(flow.nodes, 'flow', 'start');
  if (entryNodes.length === 0) {
    errors.push(validationError(
      0,
      `Flow has no entry node`,
      `/nodes`
    ));
  } else if (entryNodes.length > 1) {
    errors.push(validationError(
      0,
      `Flow has multiple entry nodes`,
      entryNodes.map(
        (node)=>
          `/nodes/${node.id}`
      )
    ));
  }

  return errors;
}

function hasTerminalNodes(flow) {
  const termNodes = getNodeType(flow.nodes, 'flow', 'end');
  let   errors    = [];
  if (termNodes.length === 0) {
    errors.push(validationError(
      0,
      `Flow has no terminal node`,
      `/nodes`
    ));
  }
  return errors;
}

function expressionsReferenceKnownVariables(flow) {
  let errors        = [];
  let flowVars      = {};

  const getVar = (el)=> { flowVars[el.name] = false; };

  flow.variables.in.forEach(getVar);
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
              `Expression ${expr} references unknown variable ${ref} in node ${node.id}`,
              `/nodes/${node.id}/parameters/expression`
            )
          );
        }
      });
    }
  );

  return errors;
}

function allNodeActionsHaveMatchingRequirements(flow) {
  let errors = [];
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
          `Node ${node.id} uses an unavailable capability '${node.nodetype}'`,
          `/nodes/${node.id}`
        ));
      }
    }
  );
  return errors;
}

function isSchemaValid(flow, schema) {
  const res = tv4.validate(flow, schema);
//   if (res === false) {
//     console.log('XFlowValidator.isSchemaValid validation error ', tv4.error);
//   }
  return res;
}

function allReturnValuesExist(flow) {
  let errors = [];

  const getName = (el) => el.name;
  const retvars = flow.variables.out.map(getName);
  const ovars   = flow.variables.in.map(getName).concat(
    flow.variables.local.map(getName)
  );

  retvars.forEach(
    (el)=> {
      if (ovars.indexOf(el) < 0) {
        errors.push(validationError(
          0,
          `Return value ${el} does not appear in scope`,
          `/variables/out/${el}`
        ));
      }
    }
  );

  return errors;
}

function variablesAreDefinedOnlyOnce(flow) {
  let errors = [];

  const getName   = (el) => el.name;
  const inVars    = flow.variables.in.map(getName);
  const localVars = flow.variables.local.map(getName);

  inVars.forEach((inV)=> {
    if (localVars.indexOf(inV) > -1) {
      errors.push(validationError(
        0,
        `Input variable ${inV} is redefined in local variables`,
        `/variables/in/${inV}`
      ));
    }
  });

  return errors;
}

/**
 * XFlowValidator - validates flow structure and content
 * @class XFlowValidator
 */
class XFlowValidator {
  constructor() {
    this.schema = FlowV1Schema;
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

    if (!isSchemaValid(flow, this.schema)) {
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
        allNodesHaveAtLeastOneEdge(flow).length === 0
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

    if (!isSchemaValid(flow, this.schema)) {
      return tv4.validateMultiple(flow, this.schema).errors.map((err)=> {
        return validationError(
          0,
          `Invalid schema : ${err.message}`,
          err.dataPath
        );
      });
    } else {

      const errors = [].concat(
        allEdgesHaveNodes(flow),
        hasOneEntryNode(flow),
        hasTerminalNodes(flow),
        allNodeActionsHaveMatchingRequirements(flow),
        expressionsReferenceKnownVariables(flow),
        allReturnValuesExist(flow),
        variablesAreDefinedOnlyOnce(flow),
        allNodesHaveAtLeastOneEdge(flow)
      );

      return errors;
    }

  }

}

export default XFlowValidator;
