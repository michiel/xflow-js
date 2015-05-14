import LangUtil from '../util/lang';

/**
 * @class AssertUtil
 */

/**
 * @method exists
 * @param {Any} o value to check
 * @throws {Error} Error
 */
export function exists(o) {
  if (!LangUtil.exists(o)) {
    throw new Error(
      `assert.exists : value does not exist`
    );
  }
}

/**
 * @method isArray
 * @param {Any} o value to check
 * @throws {Error} Error
 */
export function isArray(o) {
  exists(o);
  if (!LangUtil.isArray(o)) {
    throw new Error(
      `assert.isArray : not an Array ${o}`
    );
  }
}

/**
 * @method isBoolean
 * @param {Any} o value to check
 * @throws {Error} Error
 */
export function isBoolean(o) {
  exists(o);
  if (!LangUtil.isBoolean(o)) {
    throw new Error(
      `assert.isBoolean : not a Boolean : ${o}`
    );
  }
}

/**
 * @method isNumber
 * @throws {Error} Error
 * @param {Any} o value to check
 */
export function isNumber(o) {
  exists(o);
  if (!LangUtil.isNumber(o)) {
    throw new Error(
      `assert.isNumber : not a Number : ${o}`
    );
  }
}

/**
 * @method isString
 * @param {Any} o value to check
 * @throws {Error}
 */
export function isString(o) {
  exists(o);
  if (!LangUtil.isString(o)) {
    throw new Error(
      `assert.isString : not a String : ${o}`
    );
  }
}

/**
 * @method isObject
 * @param {Any} o value to check
 * @throws {Error}
 */
export function isObject(o) {
  exists(o);
  if (!LangUtil.isObject(o)) {
    throw new Error(
      `assert.isObject : not a Object : ${o}`
    );
  }
}

/**
 * @method isDate
 * @param {Any} o value to check
 * @throws {Error}
 */
export function isDate(o) {
  exists(o);
  if (!LangUtil.isDate(o)) {
    throw new Error(
      `assert.isDate : not a Date : ${o}`
    );
  }
}

/**
 * @method isFunction
 * @param {Any} o value to check
 * @throws {Error}
 */
export function isFunction(o) {
  exists(o);
  if (!LangUtil.isFunction(o)) {
    throw new Error(
      `assert.isFunction : not a Function : ${o}`
    );
  }
}

/**
 * @method length
 * @param {Any} o value to check
 * @param {Number} len length
 * @throws {Error}
 */
export function length(o, len) {
  exists(o);
  isNumber(o.length);
  if (o.length !== len) {
    throw new Error(
      `assert.length : required ${len} and found ${o.length}`
    );
  }
}

export default {
  exists,
  isArray,
  isString,
  isBoolean,
  isObject,
  isNumber,
  isDate,
  isFunction,
  length
};
