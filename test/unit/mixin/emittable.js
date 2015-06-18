import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import mixin          from '../../../lib/util/mixin';
import emittableMixin from '../../../lib/mixin/emittable';

describe('Emittable mixin', function() {

  it('should be mixin-able', function() {
    class Main {
      constructor() {
        this.initEmittable();
      }
    }

    mixin(Main, emittableMixin);
    const mainInst = new Main();
    expect(mainInst.emit).to.be.a('function');
    expect(mainInst.on).to.be.a('function');
    expect(mainInst.onAny).to.be.a('function');
  });

  it('should error when methods called without init', function() {
    class Main {
      constructor() {
      }
    }

    mixin(Main, emittableMixin);
    const mainInst = new Main();

    expect(()=> {
      mainInst.emit();
    }).to.throw(Error);
    expect(()=> {
      mainInst.on('test');
    }).to.throw(Error);
    expect(()=> {
      mainInst.onAny(function() {});
    }).to.throw(Error);
  });

});

