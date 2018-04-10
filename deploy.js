const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");

const provider = new HDWalletProvider(
  "leave powder desk video reform weird strategy recycle damage umbrella decade doctor",
  "https://rinkeby.infura.io/KT8kZUmncLYRx0947rhr"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  let result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode
    })
    .send({
      from: accounts[0],
      gas: "1000000"
    });

  console.log("addres  =::  ", result.options.address);
};

deploy();
