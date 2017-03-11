
import AssertUtil from '../../../src/util/assert';

describe('Assertion utils ', ()=> {

  describe('exists', ()=> {
    it('should correctly assert if a property exists', ()=> {
      const assertError = ()=> {
        AssertUtil.exists();
      };
      const assertOk = ()=> {
        AssertUtil.exists(1);
      };
      expect(assertError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('isArray', ()=> {
    it('should correctly assert if a property is an Array', ()=> {
      const assertEmptyError = ()=> {
        AssertUtil.isArray();
      };
      const assertIncorrectError = ()=> {
        AssertUtil.isArray(1);
      };
      const assertOk = ()=> {
        AssertUtil.isArray([]);
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('isString', ()=> {
    it('should correctly assert if a property is a String', ()=> {
      const assertEmptyError = ()=> {
        AssertUtil.isString();
      };
      const assertIncorrectError = ()=> {
        AssertUtil.isString(1);
      };
      const assertOk = ()=> {
        AssertUtil.isString('string');
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('isBoolean', ()=> {
    it('should correctly assert if a property is a Boolean', ()=> {
      const assertEmptyError = ()=> {
        AssertUtil.isBoolean();
      };
      const assertIncorrectError = ()=> {
        AssertUtil.isBoolean(1);
      };
      const assertOk = ()=> {
        AssertUtil.isBoolean(false);
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('isString', ()=> {
    it('should correctly assert if a property is a String', ()=> {
      const assertEmptyError = ()=> {
        AssertUtil.isString();
      };
      const assertIncorrectError = ()=> {
        AssertUtil.isString(1);
      };
      const assertOk = ()=> {
        AssertUtil.isString('string');
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('isNumber', ()=> {
    it('should correctly assert if a property is a Number', ()=> {
      const assertEmptyError = ()=> {
        AssertUtil.isNumber();
      };
      const assertIncorrectError = ()=> {
        AssertUtil.isNumber(true);
      };
      const assertOk = ()=> {
        AssertUtil.isNumber(1);
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('isObject', ()=> {
    it('should correctly assert if a property is a Object', ()=> {
      const assertEmptyError = ()=> {
        AssertUtil.isObject();
      };
      const assertIncorrectError = ()=> {
        AssertUtil.isObject(1);
      };
      const assertOk = ()=> {
        AssertUtil.isObject({});
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('isDate', ()=> {
    it('should correctly assert if a property is a Date', ()=> {
      const assertEmptyError = ()=> {
        AssertUtil.isDate();
      };
      const assertIncorrectError = ()=> {
        AssertUtil.isDate(1);
      };
      const assertOk = ()=> {
        AssertUtil.isDate((new Date()));
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('isFunction', ()=> {
    it('should correctly assert if a property is a Function', ()=> {
      const assertEmptyError = ()=> {
        AssertUtil.isFunction();
      };
      const assertIncorrectError = ()=> {
        AssertUtil.isFunction(1);
      };
      const assertOk = ()=> {
        AssertUtil.isFunction(()=> {});
      };
      expect(assertEmptyError).to.throw(Error);
      expect(assertIncorrectError).to.throw(Error);
      expect(assertOk).to.not.throw(Error);
    });

  });

  describe('length', ()=> {
    it('should correctly assert the length of a property', ()=> {
      /* jshint maxstatements:25 */
      const assertEmptyError = ()=> {
        AssertUtil.length();
      };
      const assertIncorrectError = ()=> {
        AssertUtil.length(1);
      };

      const assertOk1 = ()=> {
        AssertUtil.length([], 0);
      };
      const assertOk2 = ()=> {
        AssertUtil.length([1, 2], 2);
      };
      const assertOk3 = ()=> {
        AssertUtil.length('', 0);
      };
      const assertOk4 = ()=> {
        AssertUtil.length('123', 3);
      };

      const assertNOK1 = ()=> {
        AssertUtil.length([], 2);
      };
      const assertNOK2 = ()=> {
        AssertUtil.length([1, 2], 1);
      };
      const assertNOK3 = ()=> {
        AssertUtil.length('123', 4);
      };
      const assertNOK4 = ()=> {
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

