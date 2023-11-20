/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  paths: {
    sources: "./contracts",
    artifacts: "./src/assets/contract/artifacts"
  },
  networks: {
    ten_testnet: {
      url: "https://testnet.obscu.ro/v1/?u=<key>",
      accounts: [privateKey1]
    }
  }
};
