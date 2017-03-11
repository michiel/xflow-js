/**
 * @class LangUtil
 */

/**
 * @method exists
 * @param {Any} val value to check
 * @return {Boolean} Returns true if `val` exists
 */
export function exists(val) {
  return (
    (val !== null) &&
    (typeof(val) !== 'undefined')
  );
}

/**
 * @method clone
 * @param {Object} json JSON object
 * @return {JSON} Returns clone of `json` object
 */
export function clone(json) {
  return JSON.parse(JSON.stringify(json));
}

/**
 * @method isArray
 * @param {Any} val value to check
 * @return {Boolean} Returns `true` is `val` is an array
 */
export function isArray(val) {
  return (
    exists(val) &&
      (val.constructor === Array)
  );
}

/**
 * @method isString
 * @param {Any} val value to check
 * @return {Boolean} Returns `true` if `val` is a string
 */
export function isString(val) {
  return (
    exists(val) &&
      (val.constructor === String)
  );
}

/**
 * @method isBoolean
 * @param {Any} val value to check
 * @return {Boolean} Returns `true` is `val` is a boolean
 */
export function isBoolean(val) {
  return (
    exists(val) &&
      (val.constructor === Boolean)
  );
}

/**
 * @method isNumber
 * @param {Any} val value to check
 * @return {Boolean} Returns `true` if `val` is a number
 */
export function isNumber(val) {
  return (
    exists(val) &&
      (val.constructor === Number) &&
      !isNaN(val)
  );
}

/**
 * @method isObject
 * @param {Any} val value to check
 * @return {Boolean} Returns `true` if `val` is an object
 */
export function isObject(val) {
  return (
    exists(val) &&
      (val.constructor === Object)
  );
}

/**
 * @method isDate
 * @param {Any} val value to check
 * @return {Boolean} Returns `true` if `val` is a date
 */
export function isDate(val) {
  return (
    exists(val) &&
      (val.constructor === Date)
  );
}

/**
 * @method isFunction
 * @param {Any} val value to check
 * @return {Boolean} Returns `true` if `val` is a function
 */
export function isFunction(val) {
  return (
    exists(val) &&
      (val.constructor === Function)
  );
}

/**
 * @method hasProperty
 * @param {Object} obj to examine
 * @param {String} prop property to test
 * @return {Boolean} Returns `true` if `obj` has property `prop`
 */
export function hasProperty(obj, prop) {
  const steps = prop.split('.');
  let stepObj = obj;
  let step;

  while (steps.length) {
    step = steps.shift();

    if (!exists(stepObj[step])) {
      return false;
    } else if (
      (steps.length > 0) &&
      !isObject(stepObj[step])
    ) {
      return false;
    }

    stepObj = stepObj[step];
  }

  return true;
}

const validationMap = {
  'boolean': isBoolean,
  'number': isNumber,
  'date': isDate,
  'object': isObject,
  'array': isArray,
  'string': isString,
};

//
// TODO : Migrate to AssertUtl
//

/**
 * @method assertType
 * @param {String} type to examine value for
 * @param {Any} val value to test
 * @throws {Error}
 * @return {Null} Returns `null` if the assertion is ok
 */
export function assertType(type, val) {
  if (!(type in validationMap)) {
    throw new Error(
      `assertType : No type ${type} found`
    );
  }
  if (!validationMap[type](val)) {
    throw new Error(
      `assertType : Value ${val} is not of type ${type}`
    );
  }
}

/**
 * @method arrFromArguments
 * @param {array} args A function arguments array
 * @return {Array} Returns an array constructed from an arguments splat
 */
export function arrFromArguments(args) {
  const retA = [];
  for (let i = 0; i < args.length; i++) {
    retA.push(args[i]);
  }
  return retA;
}

/**
 * @method mergeDict
 * @param {Object} a Primary object to merge into
 * @param {Object} b Seconday object to merge
 * @return {Object} Returns object `a` extended with properties from `b` if they do not exist in `a`
 */
export function mergeDict(a, b = {}) {
  for (const keyB in b) {
    if (!exists(a[keyB])) {
      a[keyB] = b[keyB];
    }
  }

  //
  // Babel has some issues with rest-args (function(a, b, ...args){})
  // so use our own helper.
  //  - arguments isn't a real Array and has no slice
  //  - using Array.prototype.slice.call(arguments) is a performance no-no
  //

  const args = arrFromArguments(arguments);

  if (args.length > 2) {
    return mergeDict.apply(
      null,
      [a].concat(
        args.slice(2, args.length)
      )
    );
  } else {
    return a;
  }
}

export default {
  exists,
  clone,
  hasProperty,
  mergeDict,
  isArray,
  isString,
  isBoolean,
  isNumber,
  isObject,
  isDate,
  isFunction,
  assertType,
};
