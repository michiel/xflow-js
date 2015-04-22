import LangUtil from '../util/lang';

export function exists(o) {
  if (!LangUtil.exists(o)) {
    throw new Error('assert.exists : value does not exist');
  }
}

export function isArray(o) {
  exists(o);
  if (!LangUtil.isArray(o)) {
    throw new Error('assert.isArray : not an Array ' + o);
  }
}

export function isBoolean(o) {
  exists(o);
  if (!LangUtil.isBoolean(o)) {
    throw new Error('assert.isBoolean : not a Boolean ' + o);
  }
}

export function isNumber(o) {
  exists(o);
  if (!LangUtil.isNumber(o)) {
    throw new Error('assert.isNumber : not a Number ' + o);
  }
}

export function isString(o) {
  exists(o);
  if (!LangUtil.isString(o)) {
    throw new Error('assert.isString : not a String ' + o);
  }
}

export function isObject(o) {
  exists(o);
  if (!LangUtil.isObject(o)) {
    throw new Error('assert.isObject : not a Object ' + o);
  }
}

export function isDate(o) {
  exists(o);
  if (!LangUtil.isDate(o)) {
    throw new Error('assert.isDate : not a Date ' + o);
  }
}

export function isFunction(o) {
  exists(o);
  if (!LangUtil.isFunction(o)) {
    throw new Error('assert.isFunction : not a Function ' + o);
  }
}

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
  exists     : exists,
  isArray    : isArray,
  isString   : isString,
  isBoolean  : isBoolean,
  isObject   : isObject,
  isNumber   : isNumber,
  isDate     : isDate,
  isFunction : isFunction,
  length     : length
};
