import web3 from "./web3";

import TranscriptFactory from "./build/TranscriptFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(TranscriptFactory.interface),
  "0x1e07c52D1304BF41fb4AB14581Cf03C3412282A8"
);

export default instance;
