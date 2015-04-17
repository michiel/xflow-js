import XFlowValidator from './xflow-validator';

const validator = new XFlowValidator();

class XFlowStruct {

  constructor(json) {
    if (!validator.validate(json)) {
      throw new Error('XFlowStruct : Invalid flow JSON');
    }
    this.json = json;
  }
}
