import web3 from "./web3";
import Transcript from "./build/Transcript.json";

const transcript = (address) => {
  return new web3.eth.Contract(JSON.parse(Transcript.interface), address);
};
export default transcript;
