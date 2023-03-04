const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Guess", function () {
  it("Should return the new greeting once it's changed", async function () {
    const [app_developer, end_user] = await ethers.getSigners();

    // deploy the token
    const Token = await ethers.getContractFactory("ERC20");
    const token = await Token.deploy();
    await token.deployed();

    // deploy the guessing game
    const Guess = await ethers.getContractFactory("Guess");
    const guess = await Guess.deploy(10, token.address);
    await guess.deployed();

    // approve the guessing game to spend the end users tokens
    approval = await token.connect(end_user).approve(guess.address, 2)
    await approval.wait();
    expect(await token.connect(end_user).balanceOf(end_user.address)).to.equal(2);
    expect(await token.connect(end_user).allowance(end_user.address, guess.address)).to.equal(2);

    // make an attempt
    const guessAttempt = await guess.connect(end_user).attempt(5);
    await guessAttempt.wait();
  });
});
