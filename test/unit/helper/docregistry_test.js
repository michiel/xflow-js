import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

import DocRegistry from '../../../src/helper/docregistry';

describe('DocRegistry ', function() {

  it('can add and get"', function() {
    const docR = new DocRegistry();
    const exDoc = {
      id: 1,
    };
    docR.add(exDoc);
    expect(docR.get(1)).to.deep.equal(exDoc);
  });

  it('can add and remove"', function() {
    const docR = new DocRegistry();
    const exDoc = {
      id: 1,
    };
    docR.add(exDoc);
    expect(docR.has(1)).to.equal(true);
    docR.remove(1);
    expect(function() {
      docR.get(1);
    }).to.throw(Error);
  });

  it('can only add a doc once"', function() {
    const docR = new DocRegistry();
    const exDoc = {
      id: 1,
    };
    docR.add(exDoc);
    expect(function() {
      docR.add(exDoc);
    }).to.throw(Error);
  });

});

