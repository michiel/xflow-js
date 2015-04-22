
import AssertUtil from '../../../lib/util/assert';

describe('Assertion utils ', function() {

  describe('exists', function() {
    it('should correctly assert if a property exists', function() {
      var assertError = function() {
        AssertUtil.exists();
      };
      var assertOk = function() {
        AssertUtil.exists(1);
      };
      expect(assertError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('isArray', function() {
    it('should correctly assert if a property is an Array', function() {
      var assertEmptyError = function() {
        AssertUtil.isArray();
      };
      var assertIncorrectError = function() {
        AssertUtil.isArray(1);
      };
      var assertOk = function() {
        AssertUtil.isArray([]);
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('isString', function() {
    it('should correctly assert if a property is a String', function() {
      var assertEmptyError = function() {
        AssertUtil.isString();
      };
      var assertIncorrectError = function() {
        AssertUtil.isString(1);
      };
      var assertOk = function() {
        AssertUtil.isString('string');
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });


  describe('isBoolean', function() {
    it('should correctly assert if a property is a Boolean', function() {
      var assertEmptyError = function() {
        AssertUtil.isBoolean();
      };
      var assertIncorrectError = function() {
        AssertUtil.isBoolean(1);
      };
      var assertOk = function() {
        AssertUtil.isBoolean(false);
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });


  describe('isString', function() {
    it('should correctly assert if a property is a String', function() {
      var assertEmptyError = function() {
        AssertUtil.isString();
      };
      var assertIncorrectError = function() {
        AssertUtil.isString(1);
      };
      var assertOk = function() {
        AssertUtil.isString('string');
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });


  describe('isNumber', function() {
    it('should correctly assert if a property is a Number', function() {
      var assertEmptyError = function() {
        AssertUtil.isNumber();
      };
      var assertIncorrectError = function() {
        AssertUtil.isNumber(true);
      };
      var assertOk = function() {
        AssertUtil.isNumber(1);
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });


  describe('isObject', function() {
    it('should correctly assert if a property is a Object', function() {
      var assertEmptyError = function() {
        AssertUtil.isObject();
      };
      var assertIncorrectError = function() {
        AssertUtil.isObject(1);
      };
      var assertOk = function() {
        AssertUtil.isObject({});
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('isDate', function() {
    it('should correctly assert if a property is a Date', function() {
      var assertEmptyError = function() {
        AssertUtil.isDate();
      };
      var assertIncorrectError = function() {
        AssertUtil.isDate(1);
      };
      var assertOk = function() {
        AssertUtil.isDate((new Date()));
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });


});



