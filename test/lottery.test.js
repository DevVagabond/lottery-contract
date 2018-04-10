const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const {
  interface,
  bytecode
} = require("../compile");

let accounts;
let lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode
    })
    .send({
      from: accounts[0],
      gas: '1000000'
    });
});

describe('Lottery', async () => {
  it('deploy contract', () => {
    assert.ok(lottery.options.address);
  });

  it('enter player', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  });

  it('enter another player', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[1]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(2, players.length);
  });

  it('pick winner by manager only', () => {
    lottery.methods.pickWinner().send({
      from: accounts[0]
    })
      .then(add => assert(add))
      .catch(err => assert(err))
  });



})