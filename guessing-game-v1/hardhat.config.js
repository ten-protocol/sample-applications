require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy');
require('hardhat-ignore-warnings');

const { APP_DEV_PK, END_USR_PK, ARB_API_KEY } = process.env;

module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  namedAccounts: {
    app_developer: {
      default: 0,
    },
    end_user: {
      default: 1,
    },
  },
  networks: {
    obscuro: {
      deploy: ["scripts/"],
      chainId: 443,
      url: "http://testnet.obscu.ro/v1/",
      gasPrice: 2000000000,
      accounts: [`0x${APP_DEV_PK}`, `0x${END_USR_PK}`],
    },
    arbitrum: {
      deploy: ["scripts/"],
      chainId: 421613,
      url: `https://arb-goerli.g.alchemy.com/v2/${ARB_API_KEY}`,
      gasPrice: 100000000,
      accounts: [`0x${APP_DEV_PK}`, `0x${END_USR_PK}`],
    },
    hardhat: {
      deploy: ["scripts/"],
      chainId: 1337,
      accounts: [
        { privateKey: `0x${APP_DEV_PK}`, balance: "174165200000000000" },
        { privateKey: `0x${END_USR_PK}`, balance: "174165200000000000" },
      ],
    },
  },
};
