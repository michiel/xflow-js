import chai           from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs             from 'fs';
import RSVP           from 'rsvp';

chai.use(chaiAsPromised);

import XFlowDispatcher from '../../lib/xflow-dispatcher';
import XFlowFactory    from '../../lib/xflow-factory';
import XFlowRunner     from '../../lib/xflow-runner';

function getXFlowFactory() {
  return (new XFlowFactory(
    new XFlowDispatcher()
  ));
}

function getXFlowRunner() {
  return (new XFlowRunner(
    getXFlowFactory()
  ));
}

function getJSON(path) {
  var data = fs.readFileSync(path, 'utf-8');
  var json = JSON.parse(data);
  return json;
}

describe('XFlowRunner sync ', function() {

  it('runs flows', function() {
    var runner = getXFlowRunner();

    var json = getJSON('data/create_object.json');
    var id   = runner.addFlow(json);
    var res  = runner.runFlow(id);

    expect(res).to.deep.equal([{}]);

    json = getJSON('data/arithmetic_addition.json');
    id   = runner.addFlow(json);
    res  = runner.runFlow(id);

    expect(res).to.deep.equal([{
      'ReturnValue': 3
    }]);
  });

  it('runs branching flows', function() {
    var runner = getXFlowRunner();
    var json = getJSON('data/branch_boolean.json');
    var id   = runner.addFlow(json);
    var res  = runner.runFlow(id);

    expect(res).to.deep.equal([{}]);

    json = getJSON('data/branch_boolean_and_expressions_return.json');
    id   = runner.addFlow(json, {
      'MatchValue' : true
    });
    res  = runner.runFlow(id);

    expect(res).to.deep.equal([{
      'ReturnValue' : 3
    }]);

  });

  it('can single step flows', function() {
    var runner = getXFlowRunner();

    var json = getJSON('data/create_object.json');
    var id   = runner.addFlow(json);

    var counter = 0;
    while (runner.stepFlow(id)) {
      counter++;
    }

    expect(counter).to.equal(4);

    json = getJSON('data/arithmetic_addition.json');
    id   = runner.addFlow(json);

    counter = 0;
    while (runner.stepFlow(id)) {
      counter++;
    }

    expect(counter).to.equal(2);
  });

});

describe('XFlow async ', function() {

  it('loads a json flow', function() {
    var runner = getXFlowRunner();

    var json = getJSON('data/create_object.json');
    var id     = runner.addFlow(json);
    var res    = runner.runFlowQ(id);

    expect(res).to.eventually.deep.equal([{}]);

    json = getJSON('data/arithmetic_addition.json');
    id   = runner.addFlow(json);
    var resX  = runner.runFlowQ(id);

    expect(resX).to.eventually.deep.equal([{
      'ReturnValue': 3
    }]);
  });

  it('runs branching flows', function() {
    var runner = getXFlowRunner();

    var json = getJSON('data/branch_boolean.json');
    var id   = runner.addFlow(json);
    var res  = runner.runFlowQ(id);

    expect(res).to.eventually.deep.equal([{}]);

    json = getJSON('data/branch_boolean_and_expressions_return.json');
    id   = runner.addFlow(json, {
      'MatchValue' : true
    });
    var resX  = runner.runFlowQ(id);

    expect(resX).to.eventually.deep.equal([{
      'ReturnValue' : 3
    }]);

  });

  it('can single step flows', function() {
    var runner = getXFlowRunner();

    var json = getJSON('data/create_object.json');
    var id   = runner.addFlow(json);

    var defer   = RSVP.defer();
    var counter = 0;

    function nextStep() {
      counter++;
      runner.stepFlowQ(id).then(
        function(hasNext) {
          if (hasNext) {
            nextStep();
          } else {
            defer.resolve(counter);
          }
        },
        function(err) {
          console.error('nextStep test : ', err);
          defer.reject('err');
        }
      );
    }

    nextStep();

    expect(defer.promise).to.eventually.equal(5);

  });
});

