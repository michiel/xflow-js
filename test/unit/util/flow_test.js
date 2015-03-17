import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import fs from 'fs';

import FlowUtil from '../../../lib/util/flow';

var getEntryNode   = FlowUtil.getEntryNode;
var getNodeType    = FlowUtil.getNodeType;
var getNode        = FlowUtil.getNode;
var isTerminalNode = FlowUtil.isTerminalNode;

describe('XFlow utils ', function() {

  var data = fs.readFileSync('data/flows/create_object.json', 'utf-8');
  var json = JSON.parse(data);

  it('can find a single entry node', function() {
    var node = getEntryNode(json.nodes);
    var nodes = getNodeType(json.nodes, 'flow', 'start');
    expect(nodes.length).to.equal(1);
    expect(node).to.deep.equal(nodes[0]);

  });

  it('can find a terminal node', function() {
    var nodes = getNodeType(json.nodes, 'flow', 'end');
    expect(nodes.length).to.equal(1);

    expect(isTerminalNode(
      nodes[0]
    )).to.equal(true);

  });

  it('getNodeType can find all nodes when called without additional arguments', function() {
    expect(
      getNodeType(json.nodes).length
    ).to.equal(json.nodes.length);
  });

  it('getNodeType can find all nodes when called with only type arguments', function() {
    expect(
      getNodeType(json.nodes, 'flow').length
    ).to.equal(2);
  });

  it('getNodeType can find all nodes when called with only action arguments', function() {
    expect(
      getNodeType(json.nodes, null, 'end').length
    ).to.equal(1);
  });

});


describe('XFlow utils / bad data ', function() {


  it('can find a single entry node', function() {
    var data = fs.readFileSync('data/bad_flows/no_entry_nodes.json', 'utf-8');
    var json = JSON.parse(data);

    expect(function() {
      getNode(1, json.nodes);
    }).to.throw(Error);

  });

  it('can find a single entry node', function() {
    var data = fs.readFileSync('data/invalid_flows/identical_id_nodes.json', 'utf-8');
    var json = JSON.parse(data);

    expect(function() {
      getNode(1, json.nodes);
    }).to.throw(Error);

  });

});




