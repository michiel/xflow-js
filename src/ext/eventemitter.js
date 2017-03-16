import EventEmitter2 from 'eventemitter2';

const create = (args = {})=> {
  const EmitC = EventEmitter2.EventEmitter2 || EventEmitter2;
  return new EmitC(args);
};

export {
  create,
};

export default {
  create,
};
