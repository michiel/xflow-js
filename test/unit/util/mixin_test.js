import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import mixin from '../../../src/util/mixin';

describe('Mixin', function() {

  it('should add methods', function() {
    class Main {
    }

    const toMix = {
      test: function() {
        return 44;
      },
    };

    mixin(Main, toMix);
    const mainInst = new Main();
    expect(mainInst.test()).to.equal(44);
  });

  it('should add methods with proper scope', function() {
    class Main {
    }

    const toMix = {
      theValue: 45,
      test: function() {
        return this.theValue;
      },
    };

    mixin(Main, toMix);
    const mainInst = new Main();
    expect(mainInst.test()).to.equal(45);
  });

  it('should error when mixin properties exist in the class I', function() {
    class MainA {
      constructor() {
      }
    }

    const toMix = {
      constructor() {
      },
    };

    expect(function() {
      mixin(MainA, toMix);
    }).to.throw(Error);
  });

  it('should error when mixin properties exist in the class II', function() {
    class MainA {
      constructor() {
      }
      test() {
      }
    }

    const toMix = {
      test() {
      },
    };

    expect(function() {
      mixin(MainA, toMix);
    }).to.throw(Error);
  });

  it('should isolate instance values I', function() {
    class Main {
      constructor() {
        this.theValue = 1;
      }
    }

    const toMix = {
      twiggle() {
        this.theValue = this.theValue + 1;
      },
    };

    mixin(Main, toMix);

    const inst1 = new Main();
    const inst2 = new Main();

    inst2.twiggle();
    inst2.twiggle();

    expect(inst1.theValue).to.equal(1);
    expect(inst2.theValue).to.equal(3);

  });

  it('should isolate instance values II', function() {
    class Main {
      constructor() {
      }
    }

    const toMix = {
      theValue: 1,
      twiggle() {
        this.theValue = this.theValue + 1;
      },
    };

    mixin(Main, toMix);

    const inst1 = new Main();
    const inst2 = new Main();

    inst2.twiggle();
    inst2.twiggle();

    expect(inst1.theValue).to.equal(1);
    expect(inst2.theValue).to.equal(3);

  });

});

