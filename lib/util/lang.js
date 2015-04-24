export function exists(val) {
  return (
    (val !== null) &&
    (val !== undefined)
  );
}

export function isArray(val) {
  return (
    exists(val) &&
      (val.constructor === Array)
  );
}

export function isString(val) {
  return (
    exists(val) &&
      (val.constructor === String)
  );
}

export function isBoolean(val) {
  return (
    exists(val) &&
      (val.constructor === Boolean)
  );
}

export function isNumber(val) {
  return (
    exists(val) &&
      (val.constructor === Number) &&
      !isNaN(val)
  );
}

export function isObject(val) {
  return (
    exists(val) &&
      (val.constructor === Object)
  );
}

export function isDate(val) {
  return (
    exists(val) &&
      (val.constructor === Date)
  );
}

export function isFunction(val) {
  return (
    exists(val) &&
      (val.constructor === Function)
  );
}

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
  'boolean' : isBoolean,
  'number'  : isNumber,
  'date'    : isDate,
  'object'  : isObject,
  'array'   : isArray,
  'string'  : isString
};

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

export function arrFromArguments(args) {
  var retA = [];
  for (var i = 0; i < args.length; i++) {
    retA.push(args[i]);
  }
  return retA;
}

export function mergeDict(a, b={}) {
  for (let keyB in b) {
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

  var args = arrFromArguments(arguments);

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
  exists         : exists,
  hasProperty    : hasProperty,
  mergeDict      : mergeDict,
  isArray        : isArray,
  isString       : isString,
  isBoolean      : isBoolean,
  isNumber       : isNumber,
  isObject       : isObject,
  isDate         : isDate,
  isFunction     : isFunction,
  assertType     : assertType
};
