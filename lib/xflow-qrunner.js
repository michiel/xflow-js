import RSVP         from 'rsvp';
import eventemitter from './ext/eventemitter';

import XFlow    from './xflow';
import LangUtil from './util/lang';

const exists = LangUtil.exists;

class XFMap {

  constructor() {
    this.map         = {};
  }

  addFlow(flow) {
    if (!(flow instanceof XFlow)) {
      throw new Error('XFMap.addFlow : parameter is not an instance of XFlow');
    }

  }

}

function logEmission(...args) {
  console.log('RUNNER LOG EMISSION ', this.event, ...args);
}

class XFlowQRunner {

  constructor(fact, opts={}) {

    if (!exists(fact)) {
      throw new Error('XFlowRunner : No valid factory passed');
    }

    this.factory   = fact;
    this.xfmap     = new XFMap();
    this.idCounter = 0;

    this.emitter = eventemitter.create({
      wildcard : true
    });
    this.tickLimit = opts.tickLimit || 4096;

    this.factory.emitter.onAny(logEmission);
  }

}

export default XFlowQRunner;

