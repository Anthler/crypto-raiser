const dotenv = require('dotenv');
const path = require("path");
var HDWalletProvider = require("@truffle/hdwallet-provider");

const dotenvResult = dotenv.config();

if (dotenvResult.error) {
  throw dotenvResult.error;
}

const {
  MNEMONIC, PROVIDER_URL,INFURA_KEY
} = process.env;

var infuraRinkebyProvider = `${PROVIDER_URL}${INFURA_KEY}`;

var PROVIDER = new HDWalletProvider(MNEMONIC, infuraRinkebyProvider,0, 5);

module.exports = {

  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: '127.0.0.1',
      port: 8545,
      network_id: "*"
    },
    rinkeby: {
      provider: PROVIDER,
      network_id: 4, // eslint-disable-line camelcase
      gasPrice: "7000000000",
      gas: 6000000
    }
  },
  plugins: [ 
    "truffle-security"
   ],
};
