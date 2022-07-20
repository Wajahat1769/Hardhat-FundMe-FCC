require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy")
require("hardhat-gas-reporter");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
const rinkebyUrl = process.env.RINKEBY_URL || "360a3b554d439897f5493b3a5ad93b";
const rinkebyKey = process.env.key || "7c6a320f48f63553bcdde2927ca9c81d0cb825";
const apiKey = process.env.API_KEY || "qwdsdw"
const cmcKey = process.env.CMC_API_KEY || "sascwd"
module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      { version: "0.8.8" },
      { version: "0.6.6" },
    ]
  },
  networks: {
    rinkeby: {
      url: rinkebyUrl,
      chainId: 4,
      accounts: [rinkebyKey],
      blockConfirmations: 2,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337
    }
  },
  etherscan: {
    apiKey: apiKey
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: cmcKey,
    token: "ETH",
    outputFile: "gasReport.txt",
    noColors: true
  },
  namedAccounts: {
    deployer: {
      default: 0,
      //4: 1,
      // 31337:1
    },
    user: {
      default: 1
    }
  }


};
