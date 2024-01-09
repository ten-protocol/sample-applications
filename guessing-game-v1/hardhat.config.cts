// File renamed hardhat.config.cts to allow use with hardhat@esm and support ESM / module: esnext in tsconfig.json.
require('dotenv').config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'hardhat-deploy';
import 'hardhat-ignore-warnings';

const { APP_DEV_PK, END_USR_PK, OBS_USER_ID, ARB_API_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  namedAccounts: {
    app_developer: {
      default: 0,
    },
    end_user: {
      default: 1,
    },
  },
  networks: {
    obscuro: {
      deploy: [ "scripts/" ],
      chainId: 443,
      url: `https://127.0.0.1:3000/v1/${OBS_USER_ID}`,
      gasPrice: 2000000000,
      accounts: [ `0x${APP_DEV_PK}`, `0x${END_USR_PK}` ]
    },
    arbitrum: {
      deploy: [ "scripts/" ],
      chainId: 421613,
      url: `https://arb-goerli.g.alchemy.com/v2/${ARB_API_KEY}`,
      gasPrice: 100000000,
      accounts: [ `0x${APP_DEV_PK}`, `0x${END_USR_PK}` ]
    },
    hardhat: {
      deploy: [ "scripts/" ],
      chainId: 1337,
      accounts: [
        { "privateKey": `0x${APP_DEV_PK}`,  "balance": "174165200000000000" },
        { "privateKey" : `0x${END_USR_PK}`, "balance": "174165200000000000" }
      ]
    }
  },
};

export default config;
