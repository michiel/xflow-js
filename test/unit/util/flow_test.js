import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import fs from 'fs';

import FlowUtil from '../../../src/util/flow';

const getEntryNode = FlowUtil.getEntryNode;
const getNodeType = FlowUtil.getNodeType;
const getNode = FlowUtil.getNode;
const isTerminalNode = FlowUtil.isTerminalNode;
const isSameNode = FlowUtil.isSameNode;

const nextId = FlowUtil.nextId;

describe('XFlow utils ', function() {

  const data = fs.readFileSync('data/flows/create_object.json', 'utf-8');
  const json = JSON.parse(data);

  it('can find a single entry node', function() {
    const node = getEntryNode(json.nodes);
    const nodes = getNodeType(json.nodes, 'flow', 'start');
    expect(nodes.length).to.equal(1);
    expect(node).to.deep.equal(nodes[0]);

  });

  it('can find a terminal node', function() {
    const nodes = getNodeType(json.nodes, 'flow', 'end');
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

  describe('isSameNode', function() {
    it('correctly identifies identical nodes', function() {
      expect(
        isSameNode(json.nodes[0], json.nodes[0])
      ).to.equal(true);
    });

    it('correctly identifies non-identical nodes', function() {
      expect(
        isSameNode(json.nodes[0], json.nodes[1])
      ).to.equal(false);
    });
  });

});

describe('XFlow utils / bad data ', function() {

  it('can find a single entry node', function() {
    const data = fs.readFileSync('data/bad_flows/no_entry_nodes.json', 'utf-8');
    const json = JSON.parse(data);

    expect(function() {
      getNode(1, json.nodes);
    }).to.throw(Error);

  });

  it('can find a single entry node', function() {
    const data = fs.readFileSync('data/invalid_flows/identical_id_nodes.json', 'utf-8');
    const json = JSON.parse(data);

    expect(function() {
      getNode(1, json.nodes);
    }).to.throw(Error);

  });

});

describe('XFlow utils nextId ', function() {
  it('returns the next ID', function() {
    const list = [
      {
        id: 1,
      },
      {
        id: 2,
      },
    ];

    expect(nextId(list)).to.equal(3);
  });

  it('returns the next ID with a different key name', function() {
    const list = [
      {
        foo: 1,
      },
      {
        foo: 2,
      },
    ];

    expect(nextId(list, 'foo')).to.equal(3);

  });
});

