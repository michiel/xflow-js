import LangUtil from '../util/lang';

function exists(o) {
  if (!LangUtil.exists(o)) {
    throw new Error('assert.exists : value does not exist');
  }
}

function isArray(o) {
  exists(o);
  if (!LangUtil.isArray(o)) {
    throw new Error('assert.isArray : not an Array ' + o);
  }
}

function isString(o) {
  exists(o);
  if (!LangUtil.isString(o)) {
    throw new Error('assert.isString : not a String ' + o);
  }
}

function isBoolean(o) {
  exists(o);
  if (!LangUtil.isBoolean(o)) {
    throw new Error('assert.isBoolean : not a Boolean ' + o);
  }
}

function isNumber(o) {
  exists(o);
  if (!LangUtil.isNumber(o)) {
    throw new Error('assert.isNumber : not a Number ' + o);
  }
}

function isString(o) {
  exists(o);
  if (!LangUtil.isString(o)) {
    throw new Error('assert.isString : not a String ' + o);
  }
}

function isObject(o) {
  exists(o);
  if (!LangUtil.isObject(o)) {
    throw new Error('assert.isObject : not a Object ' + o);
  }
}

function isDate(o) {
  exists(o);
  if (!LangUtil.isDate(o)) {
    throw new Error('assert.isDate : not a Date ' + o);
  }
}

export default {
  exists    : exists,
  isArray   : isArray,
  isString  : isString,
  isBoolean : isBoolean,
  isObject  : isObject,
  isNumber  : isNumber,
  isDate    : isDate
};
