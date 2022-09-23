const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Guess", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Guess = await ethers.getContractFactory("Guess");
    // Deploy the guessing game with a random hidden target between 0 and 10.
    const guess = await Guess.deploy(10);
    await guess.deployed();

    expect(await guess.guesses).to.equal(0);

    const guessAttempt = await guess.attempt(5);

    // wait until the transaction is mined
    await guessAttempt.wait();

    expect(await guess.guesses).to.equal(1);
  });
});
