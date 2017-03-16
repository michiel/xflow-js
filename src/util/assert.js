import LangUtil from '../util/lang';

/**
 * Language assertions
 * @class AssertUtil
 * @static
 */

/**
 * @method exists
 * @param {Any} o value to check
 * @throws {Error} Error
 */
const exists = (o)=> {
  if (!LangUtil.exists(o)) {
    throw new Error(
      'assert.exists : value does not exist'
    );
  }
};

/**
 * @method isArray
 * @param {Any} o value to check
 * @throws {Error} Error
 */
const isArray = (o)=> {
  exists(o);
  if (!LangUtil.isArray(o)) {
    throw new Error(
      `assert.isArray : not an Array ${o}`
    );
  }
};

/**
 * @method isBoolean
 * @param {Any} o value to check
 * @throws {Error} Error
 */
const isBoolean = (o)=> {
  exists(o);
  if (!LangUtil.isBoolean(o)) {
    throw new Error(
      `assert.isBoolean : not a Boolean : ${o}`
    );
  }
};

/**
 * @method isNumber
 * @throws {Error} Error
 * @param {Any} o value to check
 */
const isNumber = (o)=> {
  exists(o);
  if (!LangUtil.isNumber(o)) {
    throw new Error(
      `assert.isNumber : not a Number : ${o}`
    );
  }
};

/**
 * @method isString
 * @param {Any} o value to check
 * @throws {Error}
 */
const isString = (o)=> {
  exists(o);
  if (!LangUtil.isString(o)) {
    throw new Error(
      `assert.isString : not a String : ${o}`
    );
  }
};

/**
 * @method isObject
 * @param {Any} o value to check
 * @throws {Error}
 */
const isObject = (o)=> {
  exists(o);
  if (!LangUtil.isObject(o)) {
    throw new Error(
      `assert.isObject : not a Object : ${o}`
    );
  }
};

/**
 * @method isDate
 * @param {Any} o value to check
 * @throws {Error}
 */
const isDate = (o)=> {
  exists(o);
  if (!LangUtil.isDate(o)) {
    throw new Error(
      `assert.isDate : not a Date : ${o}`
    );
  }
};

/**
 * @method isFunction
 * @param {Any} o value to check
 * @throws {Error}
 */
const isFunction = (o)=> {
  exists(o);
  if (!LangUtil.isFunction(o)) {
    throw new Error(
      `assert.isFunction : not a Function : ${o}`
    );
  }
};

/**
 * @method length
 * @param {Any} o value to check
 * @param {Number} len length
 * @throws {Error}
 */
const length = (o, len)=> {
  exists(o);
  isNumber(o.length);
  if (o.length !== len) {
    throw new Error(
      `assert.length : required ${len} and found ${o.length}`
    );
  }
};

/**
 * @method hasProperty
 * @param {Object} object to examine
 * @param {String} prop property to test
 * @throws {Error}
 */
const hasProperty = (obj, prop)=> {
  if (!LangUtil.hasProperty(obj, prop)) {
    throw new Error(
      `assert.hasProperty : property ${prop} not found in ${obj}`
    );
  }
};

/**
 * @method equal
 * @param {Any} a
 * @param {Any} b
 * @throws {Error}
 */
const equal = (a, b)=> {
  if (a !== b) {
    throw new Error(
      `assert.equal : value ${a} does not equal ${b}`
    );
  }
};

export {
  exists,
  isArray,
  isString,
  isBoolean,
  isObject,
  isNumber,
  isDate,
  isFunction,
  length,
  hasProperty,
  equal,
};

export default {
  exists,
  isArray,
  isString,
  isBoolean,
  isObject,
  isNumber,
  isDate,
  isFunction,
  length,
  hasProperty,
  equal,
};
