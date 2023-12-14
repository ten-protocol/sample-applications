# Example Number Guessing Game (v2)

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Create the Env File 
*Assumes a registered viewing key with Ten.*

Create a file `.env` in the project root with the below contents, where your `USER_KEY` is supplied when registering 
your VK's and your `PRIVATE_KEY` should be the private key for the account that is registered with Ten.
Please find all the registration steps in https://docs.obscu.ro/ .

```
USER_KEY = <token> 
PRIVATE_KEY = <private key>
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile for Production

```sh
npm run build
```

### Deploy Contract

```sh
npx hardhat --network ten deploy
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
