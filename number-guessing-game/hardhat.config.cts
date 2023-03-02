// File renamed hardhat.config.cts to allow use with hardhat@esm and support ESM / module: esnext in tsconfig.json.
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// Hardhat-deploy plugin - https://www.npmjs.com/package/hardhat-deploy
import 'hardhat-deploy';
// Hardhat ignore warnings plugin - https://www.npmjs.com/package/hardhat-ignore-warnings
import 'hardhat-ignore-warnings';

import fs from "fs";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat"
};

try {
  config.networks = JSON.parse(fs.readFileSync('config/networks.json', 'utf8'));
} catch (e) {
  console.log(`Failed parsing "config/networks.json" with reason - ${e}`);
}

export default config;
