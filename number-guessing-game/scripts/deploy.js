// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  // const Auction = await hre.ethers.getContractFactory("Auction");
  // const auction = await Auction.deploy(3600, 0);
  // await auction.deployed();
  // console.log("Auction deployed to:", auction.address);

  const Guess = await hre.ethers.getContractFactory("Guess");
  const guess = await Guess.deploy(4);
  await guess.deployed();
  console.log("Guess deployed to:", guess.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Note: above script has deployed contract to 0x5FbDB2315678afecb367f032d93F642f64180aa3