const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const compiledFactory = require("./build/TranscriptFactory.json");

const provider = new HDWalletProvider(
  "disagree lawsuit topple zoo glimpse ball hungry section profit napkin must flame",
  // remember to change this to your own phrase!
  "https://sepolia.infura.io/v3/76a3772af71443b9b380daf52ca80e06"
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: "10000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();

//0x89C102E8Ae1437CcB646502013F512B386841D5f deployed address
