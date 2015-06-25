import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import RSVP from 'rsvp';

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
    expect(mainInst.off).to.be.a('function');
    expect(mainInst.offAny).to.be.a('function');
    expect(mainInst.once).to.be.a('function');
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

  it('should emit events', function() {

    class Main {
      constructor() {
        this.initEmittable();
      }
    }

    mixin(Main, emittableMixin);
    const mainInst = new Main();

    const defer = RSVP.defer();

    mainInst.on('xx', function() {
      defer.resolve();
    });

    mainInst.emit('xx');

    return defer.promise;

  });

  it('should emit events with arguments', function() {

    class Main {
      constructor() {
        this.initEmittable();
      }
    }

    mixin(Main, emittableMixin);
    const mainInst = new Main();

    const defer = RSVP.defer();

    mainInst.on('xx', function(arg1, arg2) {
      expect(arg2).to.equal(1);
      defer.resolve();
    });

    mainInst.emit('xx', 1);

    return defer.promise;

  });

  it('should add and remove listeners to specific events', function() {

    class Main {
      constructor() {
        this.initEmittable();
      }
    }

    mixin(Main, emittableMixin);
    const mainInst = new Main();
    const listenFn = function() {};

    const eventName = 'xx';

    expect(
      mainInst.emitter.listeners(eventName).length
    ).to.equal(0);

    mainInst.on(eventName,listenFn);

    expect(
      mainInst.emitter.listeners(eventName).length
    ).to.equal(1);

    mainInst.off(eventName,listenFn);

    expect(
      mainInst.emitter.listeners(eventName).length
    ).to.equal(0);

  });

  it('should add and remove listeners to wildcard events', function() {

    class Main {
      constructor() {
        this.initEmittable();
      }
    }

    mixin(Main, emittableMixin);
    const mainInst = new Main();
    const listenFn = function() {};

    expect(
      mainInst.emitter.listenersAny().length
    ).to.equal(0);

    mainInst.onAny(listenFn);

    expect(
      mainInst.emitter.listenersAny().length
    ).to.equal(1);

    mainInst.offAny(listenFn);

    expect(
      mainInst.emitter.listenersAny().length
    ).to.equal(0);

  });

});

