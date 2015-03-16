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

  describe('hasProperty ', function() {

    var obj = {
      nested : {
        twodeep : {
          numValue : 1,
          falseValue : false
        },
        numValue : 1,
        falseValue : false
      },
      numValue : 1,
      falseValue : false
    };

    it('should return false for non-existant values', function() {

      expect(LangUtil.hasProperty(obj, 'none')).to.equal(false);
      expect(LangUtil.hasProperty(obj, 'nested.none')).to.equal(false);
      expect(LangUtil.hasProperty(obj, 'nested.none.none')).to.equal(false);
      expect(LangUtil.hasProperty(obj, 'nested.twodeep.none')).to.equal(false);
      expect(LangUtil.hasProperty(obj, 'none.none.none.none.none')).to.equal(false);
      expect(LangUtil.hasProperty(obj, 'falseValue.none.none.none.none')).to.equal(false);
      expect(LangUtil.hasProperty(obj, 'numValue.none.none.none.none')).to.equal(false);

    });

    it('should return true for existant values', function() {

      expect(LangUtil.hasProperty(obj, 'falseValue')).to.equal(true);
      expect(LangUtil.hasProperty(obj, 'numValue')).to.equal(true);
      expect(LangUtil.hasProperty(obj, 'nested.falseValue')).to.equal(true);
      expect(LangUtil.hasProperty(obj, 'nested.numValue')).to.equal(true);
      expect(LangUtil.hasProperty(obj, 'nested.twodeep.falseValue')).to.equal(true);
      expect(LangUtil.hasProperty(obj, 'nested.twodeep.numValue')).to.equal(true);

    });
  });

  describe('assertType ', function() {

    it('should error on invalid types', function() {

      expect(function() {
        LangUtil.assertType('fnord', 1);
      }).to.throw(Error);

      expect(function() {
        LangUtil.assertType('boolean', 1);
      }).to.throw(Error);

    });
  });

  describe('mergeDict ', function() {

    it('should properly merge 2 dicts', function() {

      expect(LangUtil.mergeDict(
        { },
        { }
      )).to.deep.equal({});

      expect(LangUtil.mergeDict(
        { 'a' : 3 },
        { 'a' : 4 }
      )).to.deep.equal({ 'a' : 3 });

    });

    it('should properly merge 3 dicts', function() {

      expect(LangUtil.mergeDict(
        { },
        { },
        { }
      )).to.deep.equal({});

      expect(LangUtil.mergeDict(
        { 'a' : 3 },
        { 'a' : 4 },
        { 'a' : 5 }
      )).to.deep.equal({ 'a' : 3 });

      expect(LangUtil.mergeDict(
        { 'a' : 3 },
        { 'a' : 4, 'check' : false },
        { 'a' : 5, 'check' : true }
      )).to.deep.equal({ 'a' : 3, 'check' : false });

    });

    it('should properly merge 4 dicts', function() {

      expect(LangUtil.mergeDict(
        { },
        { },
        { },
        { }
      )).to.deep.equal({});

      expect(LangUtil.mergeDict(
        { 'a' : 3 },
        { 'a' : 4 },
        { 'a' : 5 },
        { 'a' : 6 }
      )).to.deep.equal({ 'a' : 3 });

      expect(LangUtil.mergeDict(
        { 'a' : 3 },
        { 'a' : 4, 'check' : false },
        { 'a' : 5, 'check' : true,  'num' : 2 },
        { 'a' : 6, 'check' : false, 'num' : 3 }
      )).to.deep.equal({ 'a' : 3, 'check' : false, 'num' : 2 });

    });
  });

});



