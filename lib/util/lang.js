function exists(val) {
  return (
    (val !== null) &&
    (val !== undefined)
  );
}

function isArray(val) {
  return (
    exists(val) &&
      (val.constructor === Array)
  );
}

function isString(val) {
  return (
    exists(val) &&
      (val.constructor === String)
  );
}

function isBoolean(val) {
  return (
    exists(val) &&
      (val.constructor === Boolean)
  );
}

function isNumber(val) {
  return (
    exists(val) &&
      (val.constructor === Number) &&
      !isNaN(val)
  );
}

function isObject(val) {
  return (
    exists(val) &&
      (val.constructor === Object)
  );
}

function isDate(val) {
  return (
    exists(val) &&
      (val.constructor === Date)
  );
}

function hasProperty(obj, prop) {
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

function assertType(type, val) {
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

function arrFromArguments(args) {
  var retA = [];
  for (var i = 0; i < args.length; i++) {
    retA.push(args[i]);
  }
  return retA;
}

function mergeDict(a, b={}) {
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
  assertType     : assertType
};
