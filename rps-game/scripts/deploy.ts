import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerBalance = await deployer.provider.getBalance(deployer.address);

  console.log("Deployer: ", deployer.address);
  console.log("Deployer balance: ", deployerBalance.toString());

  const rps = await ethers.getContractFactory("RockPaperScissors");
  const rpsContract = await rps.deploy(deployer);

  await rpsContract.waitForDeployment();

  console.log(`RockPaperScissors contract deployed to: ${rpsContract.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
