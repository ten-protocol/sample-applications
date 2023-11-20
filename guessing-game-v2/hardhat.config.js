/** @type import('hardhat/config').HardhatUserConfig */

const { PRIVATE_KEY, ARB_API_KEY } = process.env;

require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
task("deploy", "Deploys the GuessingGame contract")
    .addParam("secret", "The secret number for the guessing game")
    .setAction(async (taskArgs, hre) => {
      const GuessingGame = await hre.ethers.getContractFactory("GuessingGame");
      const guessingGame = await GuessingGame.deploy(taskArgs.secret);

      await guessingGame.deployed();

      console.log("GuessingGame deployed to:", guessingGame.address);
    });


module.exports = {
  solidity: "0.8.19",
  paths: {
    sources: "./contracts",
    artifacts: "./src/assets/contract/artifacts"
  },
  networks: {
    ten: {
      deploy: ["scripts/"],
      chainId: 443,
      url: "http://testnet.obscu.ro/v1/",
      gasPrice: 2000000000,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    arbitrum: {
      deploy: ["scripts/"],
      chainId: 421613,
      url: `https://arb-goerli.g.alchemy.com/v2/${ARB_API_KEY}`,
      gasPrice: 100000000,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    hardhat: {
      deploy: ["scripts/"],
      chainId: 1337,
      accounts: [
        { privateKey: `0x${PRIVATE_KEY}`, balance: "174165200000000000" },
      ],
    },
  },
};
