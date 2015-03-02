import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import Util from '../../lib/flow-util';

describe('XFlow utils ', function() {

  describe('exists ', function() {
    it('should always return false for various null forms', function() {
      var res;
      res = Util.exists();
      expect(res).to.equal(false);
      res = Util.exists(null);
      expect(res).to.equal(false);
      res = Util.exists(undefined);
      expect(res).to.equal(false);
    });
  });

  describe('isArray ', function() {
    it('should always return false for various null forms', function() {
      var res;
      res = Util.isArray();
      expect(res).to.equal(false);
      res = Util.isArray(null);
      expect(res).to.equal(false);
      res = Util.isArray(undefined);
      expect(res).to.equal(false);
    });
    it('should always return false for various non-Array values', function() {
      var res;
      res = Util.isArray(Array);
      expect(res).to.equal(false);
      res = Util.isArray('array');
      expect(res).to.equal(false);
      res = Util.isArray(false);
      expect(res).to.equal(false);
    });
    it('should always return true for Arrays', function() {
      var res;
      res = Util.isArray([]);
      expect(res).to.equal(true);
      res = Util.isArray([1,2,3]);
      expect(res).to.equal(true);
    });
  });

  describe('isString ', function() {
    it('should always return false for various null forms', function() {
      var res;
      res = Util.isString();
      expect(res).to.equal(false);
      res = Util.isString(null);
      expect(res).to.equal(false);
      res = Util.isString(undefined);
      expect(res).to.equal(false);
    });
    it('should always return false for various non-String values', function() {
      var res;
      res = Util.isString();
      expect(res).to.equal(false);
      res = Util.isString(123);
      expect(res).to.equal(false);
      res = Util.isString([]);
      expect(res).to.equal(false);
      res = Util.isString({});
      expect(res).to.equal(false);
      res = Util.isString([1,2,3]);
      expect(res).to.equal(false);
    });
    it('should always return true for String values', function() {
      var res;
      res = Util.isString('');
      expect(res).to.equal(true);
      res = Util.isString('string');
      expect(res).to.equal(true);
    });
  });

  describe('isBoolean ', function() {
    it('should always return false for various null forms', function() {
      var res;
      res = Util.isBoolean();
      expect(res).to.equal(false);
      res = Util.isBoolean(null);
      expect(res).to.equal(false);
      res = Util.isBoolean(undefined);
      expect(res).to.equal(false);
    });
    it('should always return false for various non-Boolean values', function() {
      var res;
      res = Util.isBoolean();
      expect(res).to.equal(false);
      res = Util.isBoolean(123);
      expect(res).to.equal(false);
      res = Util.isBoolean([]);
      expect(res).to.equal(false);
      res = Util.isBoolean({});
      expect(res).to.equal(false);
      res = Util.isBoolean([1,2,3]);
      expect(res).to.equal(false);
    });
    it('should always return true for Boolean values', function() {
      var res;
      res = Util.isBoolean(true);
      expect(res).to.equal(true);
      res = Util.isBoolean(false);
      expect(res).to.equal(true);
    });
  });

  describe('isNumber ', function() {
    it('should always return false for various null forms', function() {
      var res;
      res = Util.isNumber();
      expect(res).to.equal(false);
      res = Util.isNumber(null);
      expect(res).to.equal(false);
      res = Util.isNumber(undefined);
      expect(res).to.equal(false);
    });
    it('should always return false for various non-Number values', function() {
      var res;
      res = Util.isNumber();
      expect(res).to.equal(false);
      res = Util.isNumber(NaN);
      expect(res).to.equal(false);
      res = Util.isNumber([]);
      expect(res).to.equal(false);
      res = Util.isNumber({});
      expect(res).to.equal(false);
      res = Util.isNumber([1,2,3]);
      expect(res).to.equal(false);
    });
    it('should always return true for Number values', function() {
      var res;
      res = Util.isNumber(10);
      expect(res).to.equal(true);
      res = Util.isNumber(-10);
      expect(res).to.equal(true);
      res = Util.isNumber(0);
      expect(res).to.equal(true);
      res = Util.isNumber(10e10);
      expect(res).to.equal(true);
      res = Util.isNumber(0.0);
      expect(res).to.equal(true);
      res = Util.isNumber(3.5);
      expect(res).to.equal(true);
      res = Util.isNumber(Math.PI);
      expect(res).to.equal(true);
    });
  });

});



