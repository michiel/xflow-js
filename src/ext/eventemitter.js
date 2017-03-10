import EventEmitter2 from 'eventemitter2';

export default {
  create: function(args = {}) {
    const EmitC = EventEmitter2.EventEmitter2 || EventEmitter2;
    return new EmitC(args);
  },
};
