# Instructions to Deploy on Your Own

## 1. Install MetaMask
[Install](https://metamask.io/download/) MetaMask either as a browser extension or mobile app.

## 2. Configure MetaMask for Obscuro
- Visit the [Obscuro hosted gateway](https://testnet.obscu.ro/) for wallet setup.
- Click on 'Join' and follow the on-screen instructions.

## 3. Acquire Testnet ETH Tokens
To perform transactions, you'll need testnet ETH tokens. Join our [Discord Server](http://discord.gg/hbbfThQHT3), open the #faucet-requests channel request for tokens.

## 4. Set Up Your Development Environment
- Choose the IDE of your choice.
- Compile the ERC 20 contract first and deploy it to the Obscuro testnet. Note down the address.
- Compile the Guess contract. To deploy it, you will have to pass the ERC20 contract address and the range of a guess number as input. Deploy it and note down the address.
- Finally, open the `/pages/index.js` file and update the `guessContractAddress` and `erc20ContractAddress` with the respective values.

## 5. Build & Run Your Frontend
- To start playing the guessing game, build and run your frontend.
- Don't forget to share the guessing game with your friends and tweak the code to add more features!