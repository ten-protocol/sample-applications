/** @type import('hardhat/config').HardhatUserConfig */

require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");

const { PRIVATE_KEY, USER_KEY } = process.env;

task("deploy", "Deploys the ConstitutionDAO contract").setAction(
  async (taskArgs, hre) => {
    const ConstitutionDAO = await hre.ethers.getContractFactory(
      "ConstitutionDAO"
    );
    const constitutionDAO = await ConstitutionDAO.deploy();
    await constitutionDAO.deployed();

    console.log("ConstitutionDAO deployed to:", ConstitutionDAO.address);
  }
);

module.exports = {
  solidity: "0.8.19",
  paths: {
    sources: "./contracts",
    artifacts: "./src/contracts/artifacts",
  },
  networks: {
    ten: {
      chainId: 443,
      url: `https://testnet.ten.xyz/v1/${USER_KEY}`,
      gasPrice: 2000000000,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
