const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  
  // ERC20 contract.
  const ERC20 = await hre.ethers.getContractFactory("ERC20");
  const erc20 = await ERC20.deploy();
  await erc20.deployed();
  console.log("ERC20 deployed to:", erc20.address);

  // Guess contract. For now, the guess range is hardcoded as 0-99.
  const Guess = await hre.ethers.getContractFactory("Guess");
  const guess = await Guess.deploy(100, erc20.address);
  await guess.deployed();
  console.log("Guess deployed to:", guess.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });