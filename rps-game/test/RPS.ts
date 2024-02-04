import { expect } from "chai";
import { ethers } from "hardhat";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("RockPaperScissors", function () {
  async function deployRockPaperScissorsFixture() {
    const [player1, player2] = await ethers.getSigners();

    const RockPaperScissors = await ethers.getContractFactory(
      "RockPaperScissors"
    );
    const rockPaperScissors = await RockPaperScissors.deploy();

    return { rockPaperScissors, player1, player2 };
  }

  describe("Game Flow", function () {
    it("Should allow players to start the game", async function () {
      const { rockPaperScissors, player1, player2 } = await loadFixture(
        deployRockPaperScissorsFixture
      );

      await rockPaperScissors.connect(player1).startGame(player2.address);
      const isGameStarted = await rockPaperScissors.gameStarted();
      expect(isGameStarted).to.be.true;
    });

    it("Should allow players to submit choices", async function () {
      const { rockPaperScissors, player1 } = await loadFixture(
        deployRockPaperScissorsFixture
      );

      await rockPaperScissors
        .connect(player1)
        .startGame(ethers.Wallet.createRandom().address);
      await rockPaperScissors.connect(player1).submitChoice(1); // Player 1 chooses Rock
      const player1Choice = await rockPaperScissors.player1Choice();
      expect(player1Choice).to.equal(1);
    });

    it("Should determine the winner correctly", async function () {
      const { rockPaperScissors, player1, player2 } = await loadFixture(
        deployRockPaperScissorsFixture
      );

      await rockPaperScissors.connect(player1).startGame(player2.address);
      await rockPaperScissors.connect(player1).submitChoice(1); // Player 1 chooses Rock
      await rockPaperScissors.connect(player2).submitChoice(2); // Player 2 chooses Paper

      await time.advanceBlock();

      const winner = await rockPaperScissors.getWinner();
      expect(winner).to.equal(player2.address);
    });
  });
});
