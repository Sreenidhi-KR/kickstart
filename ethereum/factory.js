import web3 from "./web3";

import TranscriptFactory from "./build/TranscriptFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(TranscriptFactory.interface),
  "0x6aF034F2f68C6428891a7E30275a557d10723919"
);

export default instance;
