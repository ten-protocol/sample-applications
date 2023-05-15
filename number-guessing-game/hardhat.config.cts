// File renamed hardhat.config.cts to allow use with hardhat@esm and support ESM / module: esnext in tsconfig.json.
require('dotenv').config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'hardhat-deploy';
import 'hardhat-ignore-warnings';

const { APP_DEV_PK, END_USR_PK } = process.env;

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
      chainId: 777,
      url: "http://127.0.0.1:3000",
      obscuroEncRpcUrl: "ws://127.0.0.1:13001",
      gasPrice: 2000000000,
      accounts: [ `0x${APP_DEV_PK}`, `0x${END_USR_PK}` ]
    },
    arbitrum: {
      deploy: [ "scripts/" ],
      chainId: 421613,
      url: "https://arb-goerli.g.alchemy.com/v2/jHwvOwJIBbcpcv95SGolTONziapOitU6",
      gasPrice: 100000000,
      accounts: [`0x${APP_DEV_PK}`, `0x${END_USR_PK}` ]
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
