// File renamed hardhat.config.cts to allow use with hardhat@esm and support ESM / module: esnext in tsconfig.json.
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts: {count: 2},
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      loggingEnabled: false
    }
  }
};

export default config;
