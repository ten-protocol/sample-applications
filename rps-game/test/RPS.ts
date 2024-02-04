import { expect } from "chai";
import { ethers } from "hardhat";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("RockPaperScissors", function () {
  async function deployRockPaperScissorsFixture() {
    const [deployer, player1, player2] = await ethers.getSigners();

    const RockPaperScissors = await ethers.getContractFactory(
      "RockPaperScissors"
    );
    const rockPaperScissors = await RockPaperScissors.deploy(deployer.address);

    return { rockPaperScissors, deployer, player1, player2 };
  }

  describe("Game Flow", function () {
    it("Should allow players to start the game", async function () {
      const { rockPaperScissors, deployer, player1, player2 } =
        await loadFixture(deployRockPaperScissorsFixture);

      await rockPaperScissors
        .connect(player1)
        .startGame(player2.address, { value: ethers.parseEther("0.001") });
      const isGameStarted = await rockPaperScissors.gameStarted();
      expect(isGameStarted).to.be.true;
    });

    it("Should determine the winner correctly", async function () {
      const { rockPaperScissors, player1, player2 } = await loadFixture(
        deployRockPaperScissorsFixture
      );

      await rockPaperScissors
        .connect(player1)
        .startGame(player2.address, { value: ethers.parseEther("0.001") });

      await rockPaperScissors.connect(player1).submitChoice(1); // Player 1 chooses Rock
      await rockPaperScissors.connect(player2).submitChoice(2); // Player 2 chooses Paper

      await time.advanceBlock();

      const winner = await rockPaperScissors.getWinner();
      expect(winner).to.equal(player2.address);
    });
  });

  describe("Ownership and Withdrawal", function () {
    it("Should allow the owner to set commission percentage", async function () {
      const { rockPaperScissors, deployer } = await loadFixture(
        deployRockPaperScissorsFixture
      );

      await rockPaperScissors.connect(deployer).setCommissionPercentage(5);
      const commissionPercentage =
        await rockPaperScissors.commissionPercentage();
      expect(commissionPercentage).to.equal(5);
    });

    it("Should allow the owner to withdraw the contract balance", async function () {
      const { rockPaperScissors, deployer, player1 } = await loadFixture(
        deployRockPaperScissorsFixture
      );

      await rockPaperScissors
        .connect(player1)
        .startGame(ethers.Wallet.createRandom().address, {
          value: ethers.parseEther("0.001"),
        });
      await rockPaperScissors.connect(deployer).withdrawBalance();

      const contractBalance = await ethers.provider.getBalance(
        rockPaperScissors.getAddress()
      );
      expect(contractBalance).to.equal(0);
    });
  });
});
