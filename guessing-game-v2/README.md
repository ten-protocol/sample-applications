# guessing-game-v2

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Deploy contract

*Assumes a registered viewing key with Ten.*

Make sure to fill in the `PRIVATE_KEY` and `USER_KEY` env var.
Your `USER_KEY` is supplied when registering your VK's.
Your `PRIVATE_KEY` should be the private key for the account that is registered with Ten.
Please find all the registration steps in https://docs.obscu.ro/ . 

```sh
USER_KEY=5ee8d8a8d8765578330d5fa239214a8c118ecc0042b5a857a9748d98d332b7b7 PRIVATE_KEY=ebccc515b1ade8224deb71806d66ca326e5e564b61a0f6bd3f0f3350ad6662c9 npx hardhat --network ten deploy --secret <SECRET_NUMBER>
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
