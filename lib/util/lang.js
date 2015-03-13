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

function mergeDict(a, b, ...args) {
  args = args || [];

  for (let keyB in b) {
    if (!exists(a[keyB])) {
      a[keyB] = b[keyB];
    }
  }

  if (args.length > 0) {
    return mergeDict.apply([a].concat(args));
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
