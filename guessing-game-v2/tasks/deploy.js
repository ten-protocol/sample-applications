task("deploy-guessinggame", "Deploys the GuessingGame contract")
    .addParam("secret", "The secret number for the guessing game")
    .setAction(async (taskArgs, hre) => {
        const GuessingGame = await hre.ethers.getContractFactory("GuessingGame");
        const guessingGame = await GuessingGame.deploy(taskArgs.secretNumber);

        await guessingGame.deployed();

        console.log("GuessingGame deployed to:", guessingGame.address);
    });
