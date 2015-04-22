
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

  describe('isFunction', function() {
    it('should correctly assert if a property is a Function', function() {
      var assertEmptyError = function() {
        AssertUtil.isFunction();
      };
      var assertIncorrectError = function() {
        AssertUtil.isFunction(1);
      };
      var assertOk = function() {
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
      var assertEmptyError = function() {
        AssertUtil.length();
      };
      var assertIncorrectError = function() {
        AssertUtil.length(1);
      };

      var assertOk1 = function() {
        AssertUtil.length([], 0);
      };
      var assertOk2 = function() {
        AssertUtil.length([1,2], 2);
      };
      var assertOk3 = function() {
        AssertUtil.length('', 0);
      };
      var assertOk4 = function() {
        AssertUtil.length('123', 3);
      };

      var assertNOK1 = function() {
        AssertUtil.length([], 2);
      };
      var assertNOK2 = function() {
        AssertUtil.length([1,2], 1);
      };
      var assertNOK3 = function() {
        AssertUtil.length('123', 4);
      };
      var assertNOK4 = function() {
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



