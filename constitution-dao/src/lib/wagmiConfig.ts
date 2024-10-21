import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  braveWallet,
  metaMaskWallet,
  rabbyWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createWalletClient, custom, defineChain } from "viem";
import { createConfig } from "wagmi";

export const ten = defineChain({
  id: 443,
  name: "TEN CHAIN",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [],
    },
  },
  blockExplorers: {
    default: { name: "Tenscan", url: "https://testnet.tenscan.io" },
  },
});

export const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, braveWallet, rabbyWallet],
    },
  ],
  {
    appName: "TEN: CONSTITUTION DAO",
    projectId: "443",
  }
);

export const wagmiConfig = createConfig({
  chains: [ten],
  client({ chain }) {
    return createWalletClient({ chain, transport: custom(window.ethereum!) });
  },
  ssr: true,
  connectors,
});
