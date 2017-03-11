import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import FloxParser from '../../src/flox-parser';

const parse = FloxParser.parse;

const arithmeticTests = [
  {
    expr: '1+2',
    res: 3,
  },
  {
    expr: '1+2+3',
    res: 6,
  },
  {
    expr: '1*2',
    res: 2,
  },
  {
    expr: '11+255',
    res: 266,
  },
  {
    expr: '2-1',
    res: 1,
  },
  {
    expr: '22*2',
    res: 44,
  },
  {
    expr: '4/2',
    res: 2,
  },
  {
    expr: '22*2/2',
    res: 22,
  },
  {
    expr: '1',
    res: 1,
  },
];

const comparisonTests = [
  {
    expr: '2>1',
    res: true,
  },
  {
    expr: '1>2',
    res: false,
  },
  {
    expr: '2==1',
    res: false,
  },
  {
    expr: '2!=1',
    res: true,
  },
  {
    expr: '2>=1',
    res: true,
  },
  {
    expr: '2<=1',
    res: false,
  },
];

describe('FloxParser ', function() {

  it('should correctly perform arithmetic with a numeric result', function() {
    arithmeticTests.forEach(function(test) {
      expect(
        parse(test.expr)
      ).to.equal(test.res);
    });
  });

  it('should correctly perform comparisons with a boolean result ', function() {
    comparisonTests.forEach(function(test) {
      expect(
        parse(test.expr)
      ).to.equal(test.res);
    });
  });

});

