# Basic Sample Obscuro Project

## Introduction
This project demonstrates a basic Obscuro use case, which is a simple number guessing game. The contract generates a 
random secret number when it's deployed, which is never revealed to an operator or end-user because of the privacy 
benefits of Obscuro. The goal of the game is to guess this number, and each time an attempt is made, an entrance fee of 
1 token is paid. If a user correctly guesses the number, the contract will pay out all of the accumulated entrance 
fees to them, and reset itself with a new random number.

Without Obscuro, it would be possible to look up the internal state of the contract and cheat, and the game wouldn't work. 

The contract functionality comes with two contracts; a basic ERC20 contract which allows the user to hold assets and 
pay the entrance fee to the game, and the game contract itself. This includes a test for that contract, and a sample 
script that deploys that contract.

In developing this game, the following tools were used:
* Git (Source code versioning tool)
* NPM (Node Package Manager, available on many platforms)
* NPX (Node Package Execution, used as a runtime for Hardhat tasks)
* Hardhat (a complete Ethereum compiler and test deployment environment)
* Ethers.js (a Web3 Javascript library)
* Vite (a packaging library, handy for compiling Typescript)
* Metamask (a popular wallet for crypto tokens and smart contract interaction)
* Obscuro Testnet (an open, permissionless test network for Obscuro)
* Obscuro Wallet Extension (a proxy for an Obscuro node, which handles encryption for all data between the wallet and the network)

## Environment Setup
The following steps are required:
1. Clone this repository into a suitable folder.
2. Install NPM and NPX, and ensure they are running correctly. This is outside the scope of this project.
3. Install NPM packages specified in `package.json` by running:
```shell
npm install
npm install hardhat@esm
```
4. Hardhat and its dependencies will have been installed in the previous step. More details are available at 
https://hardhat.org/hardhat-runner/docs/getting-started#overview. Once Hardhat is installed, try running some of the 
following tasks:
```shell
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat help
```
5. A `.env` file should be created in the project root containing the private keys of the two accounts used by the 
sample, `APP_DEV_PK` and `END_USR_PK`. A third key `CHEAT_PK` can optionally be included to include the PK of an 
account that tries to cheat the game using the scripts in `demo-utils`, though this is optional for running of the game
and primarily used for demo purposes. Should you wish to deploy the game against Arbitrum the API key should also be 
included, e.g. 
```shell
APP_DEV_PK=<pk>
END_USR_PK=<pk>
CHEAT_PK=<pk>
ARB_API_KEY=<key>
```

## Running the game against a Hardhat Network
1. Starting Hardhat with `npx hardhat node` will start a local hardhat network and will deploy the ERC20 token and game 
contracts. You should take notice of the contract addresses for later. 

![Start Hardhat](./readme-images/hardhat-start.png)

2. Set up Metamask with the Hardhat network on `http://127.0.0.1:8545/` with chain ID 1337. 

![Metamask network](./readme-images/metamask-network-0.png)

3. If not already done, import the accounts into Metamask using the private keys from the `.env` file. Note that you 
may have to clear activity and nonce data in metamask if you have previously used these accounts against hardhat 
or any other network. 

![Metamask import](./readme-images/metamask-import.png)

4. Rename the accounts to be more user-friendly.

![Metamask accounts](./readme-images/metamask-accounts.png)

5. Edit the [index.ts](./src/index.ts) file to ensure the correct contract addresses are being used. Once done, start 
the user interface for the game using `npm run dev`.

![User interface start](./readme-images/user-interface-start.png)

6. The app is not initially connected to Metamask, and when the page first loads, it should prompt Metamask to pop up 
and seek connection wth the end-user account (you might want to first completely close your browser before performing). 
You should approve this.

![Metamask connect](./readme-images/metamask-connect.png)

7. After connection, the user interface should now show the address of the game contract and be ready to play. Before 
playing you must approve the ERC20 contract to allow the game to spend your tokens, using the approve facility on the 
user interface. 

![App UI initial](./readme-images/app-ui-initial.png)

8. Approve the game for the number of guesses you want to perform.

![Metamask approve](./readme-images/metamask-approve-ogg.png) ![App UI approve response](./readme-images/app-ui-approve-ogg.png)

9. Submit a guess and see if you're correct!

![Metamask submit guess](./readme-images/metamask-approve-play.png) ![App UI approve response](./readme-images/app-ui-play.png)

## Running the game against an Arbitrum Network
Running the game against Arbitrum follows the same steps as for running against a local Hardhat network, with the
exception that you have to deploy the game and token contracts first. You should first update the keys to use
in the [dotenv](./.env) file to values unique to your accounts on Arbitrum and add in the API key to use. Funds should 
be available on both accounts and can be obtained using the [Arbitrum faucet server](https://faucet.triangleplatform.com/arbitrum/goerli). 

1. Set up Metamask with the Arbitrum network as described [here](https://docs.alchemy.com/docs/how-to-add-arbitrum-to-metamask).

2. Deploy the contracts using `npx hardhat deploy --network arbitrum` and take a note of the contract addresses from the 
console.

3. Update the contract addresses `ERC20_ADDRESS` and `GUESS_ADDRESS` in [index.ts](./src/index.ts).

4. Follow the steps as described previously to approve tokens to the game, and to make a guess!


## Running the game against an Obscuro Network
Because Obscuro uses the same tools and EVM as Ethereum itself, it should be possible to replay the previous steps with 
Obscuro's Testnet. As Testnet is not ephemeral for running development like HardHat, you should update the keys to use 
in the [dotenv](./.env) file to values unique to you. 

1. Set up Metamask with the Obscuro network as described [here](https://docs.obscu.ro/wallet-extension/configure-metamask).

2. Start up the wallet extension as described [here](https://docs.obscu.ro/wallet-extension/wallet-extension/) and
generate a viewing key for both the end user accounts and application developer accounts. Note that it is important 
at the moment that the end user is registered before the application developer due to the way event relevancy checks
are performed when multiple accounts are registered through a single wallet extension. Because the wallet extension 
persists viewing keys locally you may want to delete the persistence file at `~/.obscuro/wallet_extension_persistence`
before starting the wallet extension, and re-register the keys in the correct order. 

![Wallet start](./readme-images/wallet-start.png)

3. When a viewing key is requested, Metamask will ask for permission to connect to the wallet extension "network", and 
then request the user to sign a "generate viewing key" transaction.

![Wallet start](./readme-images/wallet-ephemeral.png)

4. Request OBX funds for the two accounts using the [token faucet](https://docs.obscu.ro/testnet/faucet/).

![Faucet](./readme-images/faucet-allocate.png)

5. Deploy the contracts to the Obscuro Testnet using `npx hardhat deploy --network obscuro`. Take a note of the contract
addresses from the console. 

6. Confirm and update the contract addresses `ERC20_ADDRESS` and `GUESS_ADDRESS` in [index.ts](./src/index.ts).

7. Follow the steps as described previously to approve tokens to the game, and to make a guess!

