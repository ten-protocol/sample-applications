import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    obscuro: {
      url: "https://testnet.obscu.ro/V1/",
      accounts: [vars.get("PRIVATE_KEY")],
    },
  },
};

export default config;
