
import AssertUtil from '../../../src/util/assert';

describe('Assertion utils ', function() {

  describe('exists', function() {
    it('should correctly assert if a property exists', function() {
      const assertError = function() {
        AssertUtil.exists();
      };
      const assertOk = function() {
        AssertUtil.exists(1);
      };
      expect(assertError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('isArray', function() {
    it('should correctly assert if a property is an Array', function() {
      const assertEmptyError = function() {
        AssertUtil.isArray();
      };
      const assertIncorrectError = function() {
        AssertUtil.isArray(1);
      };
      const assertOk = function() {
        AssertUtil.isArray([]);
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('isString', function() {
    it('should correctly assert if a property is a String', function() {
      const assertEmptyError = function() {
        AssertUtil.isString();
      };
      const assertIncorrectError = function() {
        AssertUtil.isString(1);
      };
      const assertOk = function() {
        AssertUtil.isString('string');
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('isBoolean', function() {
    it('should correctly assert if a property is a Boolean', function() {
      const assertEmptyError = function() {
        AssertUtil.isBoolean();
      };
      const assertIncorrectError = function() {
        AssertUtil.isBoolean(1);
      };
      const assertOk = function() {
        AssertUtil.isBoolean(false);
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('isString', function() {
    it('should correctly assert if a property is a String', function() {
      const assertEmptyError = function() {
        AssertUtil.isString();
      };
      const assertIncorrectError = function() {
        AssertUtil.isString(1);
      };
      const assertOk = function() {
        AssertUtil.isString('string');
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('isNumber', function() {
    it('should correctly assert if a property is a Number', function() {
      const assertEmptyError = function() {
        AssertUtil.isNumber();
      };
      const assertIncorrectError = function() {
        AssertUtil.isNumber(true);
      };
      const assertOk = function() {
        AssertUtil.isNumber(1);
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('isObject', function() {
    it('should correctly assert if a property is a Object', function() {
      const assertEmptyError = function() {
        AssertUtil.isObject();
      };
      const assertIncorrectError = function() {
        AssertUtil.isObject(1);
      };
      const assertOk = function() {
        AssertUtil.isObject({});
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('isDate', function() {
    it('should correctly assert if a property is a Date', function() {
      const assertEmptyError = function() {
        AssertUtil.isDate();
      };
      const assertIncorrectError = function() {
        AssertUtil.isDate(1);
      };
      const assertOk = function() {
        AssertUtil.isDate((new Date()));
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('isFunction', function() {
    it('should correctly assert if a property is a Function', function() {
      const assertEmptyError = function() {
        AssertUtil.isFunction();
      };
      const assertIncorrectError = function() {
        AssertUtil.isFunction(1);
      };
      const assertOk = function() {
        AssertUtil.isFunction(function() {});
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('length', function() {
    it('should correctly assert the length of a property', function() {
      /* jshint maxstatements:25 */
      const assertEmptyError = function() {
        AssertUtil.length();
      };
      const assertIncorrectError = function() {
        AssertUtil.length(1);
      };

      const assertOk1 = function() {
        AssertUtil.length([], 0);
      };
      const assertOk2 = function() {
        AssertUtil.length([1, 2], 2);
      };
      const assertOk3 = function() {
        AssertUtil.length('', 0);
      };
      const assertOk4 = function() {
        AssertUtil.length('123', 3);
      };

      const assertNOK1 = function() {
        AssertUtil.length([], 2);
      };
      const assertNOK2 = function() {
        AssertUtil.length([1, 2], 1);
      };
      const assertNOK3 = function() {
        AssertUtil.length('123', 4);
      };
      const assertNOK4 = function() {
        AssertUtil.length('123', 2);
      };

      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);

      expect(assertOk1).to.not.throw(Error);
      expect(assertOk2).to.not.throw(Error);
      expect(assertOk3).to.not.throw(Error);
      expect(assertOk4).to.not.throw(Error);

      expect(assertNOK1).to.throw(Error);
      expect(assertNOK2).to.throw(Error);
      expect(assertNOK3).to.throw(Error);
      expect(assertNOK4).to.throw(Error);
    });

  });

});

