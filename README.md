# Basic Sample Obscuro Project

## Introduction
This project demonstrates a basic Obscuro use case, which is a simple number guessing game. The contract generates a random secret number when it's deployed, which is never revealed to an operator or end-user because of the privacy benefits of Obscuro. The goal of the game is to guess this number, and each time an attempt is made, an entrance fee of 1 token is paid. If a user correctly guesses the number, the contract will pay out all of the accumulated entrance fees to them, and reset itself with a new random number.

Without Obscuro, it would be possible to look up the internal state of the contract and cheat, and the game wouldn't work. 

The contract functionality comes with two contracts in the `Guess.sol` file; a basic ERC20 contract which allows the user to hold assets and pay the entrance fee to the game, and the game contract itself. This includes a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

In developing this game, the following tools were used:
* Git (Source code versioning tool)
* NPM (Node Package Manager, available on many platforms)
* NPX (Node Package Execution, used as a runtime for Hardhat tasks)
* Hardhat (a complete Ethereum compiler and test deployment environment)
* Remix IDE (a browser-based contract deployment and low-level interaction tool)
* Svelte (a lightweight Javascript app runtime environment)
* Ethers.js (a Web3 Javascript library)
* Svelte Ethers Store (a convenience library which makes interaction with Ethers simpler when using Svelte)
* Metamask (a popular wallet for crypto tokens and smart contract interaction)
* Obscuro Testnet (an open, permissionless test network for Obscuro)

## Environment Setup
The following steps are required:
0. Install git, outside the scope for this project.
1. Clone this repository into a suitable folder.
```shell
git clone 
```
2. Install NPM and NPX, and ensure they are running correctly. This is outside the scope of this project.
3. Install NPM packages specified in `package.json` by running:
```shell
npm install
```
4. The contract is deployed initially to a Hardhat network. Hardhat and its dependencies will have been  installed in the previous step. More details are available at https://hardhat.org/hardhat-runner/docs/getting-started#overview. Once Hardhat is installed, try running some of the following tasks:
```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
5. Starting Hardhat with `npx hardhat node` will create 2 accounts. The first is used for the application developer and the second is used for an end-user. Take a note of the private keys generated for these (note that these private keys are well-known!).
![Start Hardhat](./readme-images/hardhat-start.png)
6. Set up Metamask with the Hardhat network on `http://127.0.0.1:8545/`. 
![Metamask network](./readme-images/metamask-network-0.png)
7. Import the accounts into Metamask using the private keys. 
![Metamask import](./readme-images/metamask-import.png)
8. Rename the accounts to be more user-friendly.
![Metamask accounts](./readme-images/metamask-accounts.png)
9. Launch Remix from `https://remix.ethereum.org/`
![Remix launch](./readme-images/remix-launch.png)
10. Open the contract `Guess.sol` in Remix, and compile it using a Solidity compiler > 0.8.0. 
![Remix compile](./readme-images/remix-compile.png)
11. Switch to the Networks tab in Remix, and select the Hardhat network environment.
![Remix Hardhat](./readme-images/remix-hardhat.png)
12. Deploy the ERC20Basic contract to Hardhat using the `App Developer` account, identified by its address, and take a note of the contract address.
![Deploy erc20basic](./readme-images/deploy-erc20basic.png)
13. Deploy the Guess contract to Hardhat using the `App Developer` account, and take a note of the contract address. The Guess contract constructor takes a `_size` value, which is the range for the random number to be generated within, and a `_tokenAddress` parameter, which is the address of the ERC20Basic contract deployed in the previous step. The Guess contract needs this in order to know where to take the game fee from.
![Remix deploy Guess](./readme-images/remix-deploy-guess.png)
14. Update the contract addresses `ERC20_ADDRESS` and `GUESS_ADDRESS` in [App.svelte](./src/App.svelte).
15. Switch to the transaction tab on Remix. Set up the account balances for the end-user by transferring some tokens, using the application developer account and the `transfer` function of the ERC20 contract and specifying the end-user as the recipient. Check the token balance of the end-user using the `balanceOf` function.
![Fund end user](./readme-images/fund-end-user.png)
16. Start the user interface for the game, ignoring warnings if possible.
![Svelte start](./readme-images/svelte-start.png)
17. The app is not initially connected to Metamask, and when the page first loads, it should prompt Metamask to pop up and seek connection wth the end-user account. Approve this.
![Metamask connect](./readme-images/metamask-connect.png)
18. After connection, the user interface should now show the contract address, the range of the random number, and the number of guesses so far.
![App UI initial](./readme-images/app-ui-initial.png)
19. Click on the "Approve game fee" button to allow the Guess contract to take the game entrance fee from the end-user's account. Metamask will ask for end-user account to sign a transaction to call the `approve` function, specifying the Guess contract address as the delegate.
![Metamask approve](./readme-images/metamask-approve.png)
![Metamask approved](./readme-images/metamask-approved.png)
19. Finally, have a go at guessing the number!
![Metamask guess](./readme-images/metamask-guess.png)


