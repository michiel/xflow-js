import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import LangUtil from '../../../lib/util/lang';

describe('Lang utils ', function() {

  describe('exists ', function() {
    it('should always return false for various null forms', function() {
      var res;
      res = LangUtil.exists();
      expect(res).to.equal(false);
      res = LangUtil.exists(null);
      expect(res).to.equal(false);
      res = LangUtil.exists(undefined);
      expect(res).to.equal(false);
    });
  });

  describe('isArray ', function() {
    it('should always return false for various null forms', function() {
      var res;
      res = LangUtil.isArray();
      expect(res).to.equal(false);
      res = LangUtil.isArray(null);
      expect(res).to.equal(false);
      res = LangUtil.isArray(undefined);
      expect(res).to.equal(false);
    });
    it('should always return false for various non-Array values', function() {
      var res;
      res = LangUtil.isArray(Array);
      expect(res).to.equal(false);
      res = LangUtil.isArray('array');
      expect(res).to.equal(false);
      res = LangUtil.isArray(false);
      expect(res).to.equal(false);
    });
    it('should always return true for Arrays', function() {
      var res;
      res = LangUtil.isArray([]);
      expect(res).to.equal(true);
      res = LangUtil.isArray([1,2,3]);
      expect(res).to.equal(true);
    });
  });

  describe('isString ', function() {
    it('should always return false for various null forms', function() {
      var res;
      res = LangUtil.isString();
      expect(res).to.equal(false);
      res = LangUtil.isString(null);
      expect(res).to.equal(false);
      res = LangUtil.isString(undefined);
      expect(res).to.equal(false);
    });
    it('should always return false for various non-String values', function() {
      var res;
      res = LangUtil.isString();
      expect(res).to.equal(false);
      res = LangUtil.isString(123);
      expect(res).to.equal(false);
      res = LangUtil.isString([]);
      expect(res).to.equal(false);
      res = LangUtil.isString({});
      expect(res).to.equal(false);
      res = LangUtil.isString([1,2,3]);
      expect(res).to.equal(false);
    });
    it('should always return true for String values', function() {
      var res;
      res = LangUtil.isString('');
      expect(res).to.equal(true);
      res = LangUtil.isString('string');
      expect(res).to.equal(true);
    });
  });

  describe('isBoolean ', function() {
    it('should always return false for various null forms', function() {
      var res;
      res = LangUtil.isBoolean();
      expect(res).to.equal(false);
      res = LangUtil.isBoolean(null);
      expect(res).to.equal(false);
      res = LangUtil.isBoolean(undefined);
      expect(res).to.equal(false);
    });
    it('should always return false for various non-Boolean values', function() {
      var res;
      res = LangUtil.isBoolean();
      expect(res).to.equal(false);
      res = LangUtil.isBoolean(123);
      expect(res).to.equal(false);
      res = LangUtil.isBoolean([]);
      expect(res).to.equal(false);
      res = LangUtil.isBoolean({});
      expect(res).to.equal(false);
      res = LangUtil.isBoolean([1,2,3]);
      expect(res).to.equal(false);
    });
    it('should always return true for Boolean values', function() {
      var res;
      res = LangUtil.isBoolean(true);
      expect(res).to.equal(true);
      res = LangUtil.isBoolean(false);
      expect(res).to.equal(true);
    });
  });

  describe('isNumber ', function() {
    it('should always return false for various null forms', function() {
      var res;
      res = LangUtil.isNumber();
      expect(res).to.equal(false);
      res = LangUtil.isNumber(null);
      expect(res).to.equal(false);
      res = LangUtil.isNumber(undefined);
      expect(res).to.equal(false);
    });
    it('should always return false for various non-Number values', function() {
      var res;
      res = LangUtil.isNumber();
      expect(res).to.equal(false);
      res = LangUtil.isNumber(NaN);
      expect(res).to.equal(false);
      res = LangUtil.isNumber([]);
      expect(res).to.equal(false);
      res = LangUtil.isNumber({});
      expect(res).to.equal(false);
      res = LangUtil.isNumber([1,2,3]);
      expect(res).to.equal(false);
    });
    it('should always return true for Number values', function() {
      var res;
      res = LangUtil.isNumber(10);
      expect(res).to.equal(true);
      res = LangUtil.isNumber(-10);
      expect(res).to.equal(true);
      res = LangUtil.isNumber(0);
      expect(res).to.equal(true);
      res = LangUtil.isNumber(10e10);
      expect(res).to.equal(true);
      res = LangUtil.isNumber(0.0);
      expect(res).to.equal(true);
      res = LangUtil.isNumber(3.5);
      expect(res).to.equal(true);
      res = LangUtil.isNumber(Math.PI);
      expect(res).to.equal(true);
    });
  });

  describe('isObject ', function() {
    it('should always return false for various null forms', function() {
      var res;
      res = LangUtil.isObject();
      expect(res).to.equal(false);
      res = LangUtil.isObject(null);
      expect(res).to.equal(false);
      res = LangUtil.isObject(undefined);
      expect(res).to.equal(false);
    });
    it('should always return false for various non-Object values', function() {
      var res;
      res = LangUtil.isObject([]);
      expect(res).to.equal(false);
      res = LangUtil.isObject(123);
      expect(res).to.equal(false);
      res = LangUtil.isObject('string');
      expect(res).to.equal(false);
      res = LangUtil.isObject(NaN);
      expect(res).to.equal(false);
      res = LangUtil.isObject([1,2,3]);
      expect(res).to.equal(false);
    });
    it('should always return true for Object values', function() {
      var res;
      res = LangUtil.isObject({});
      expect(res).to.equal(true);
      res = LangUtil.isObject({ 'a' : 2 });
      expect(res).to.equal(true);
    });
  });

  describe('isDate ', function() {
    it('should always return false for various null forms', function() {
      var res;
      res = LangUtil.isDate();
      expect(res).to.equal(false);
      res = LangUtil.isDate(null);
      expect(res).to.equal(false);
      res = LangUtil.isDate(undefined);
      expect(res).to.equal(false);
    });
    it('should always return false for various non-Date values', function() {
      var res;
      res = LangUtil.isDate([]);
      expect(res).to.equal(false);
      res = LangUtil.isDate(123);
      expect(res).to.equal(false);
      res = LangUtil.isDate('string');
      expect(res).to.equal(false);
      res = LangUtil.isDate(NaN);
      expect(res).to.equal(false);
      res = LangUtil.isDate([1,2,3]);
      expect(res).to.equal(false);
      res = LangUtil.isDate(0);
      expect(res).to.equal(false);
      res = LangUtil.isDate(1231323120);
      expect(res).to.equal(false);
    });
    it('should always return true for Date values', function() {
      var res;
      res = LangUtil.isDate((new Date()));
      expect(res).to.equal(true);
    });
  });

});



