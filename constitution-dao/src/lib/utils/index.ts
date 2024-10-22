import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Network } from "../enums/network";
import { Environment } from "../types/ui";
import { environment } from "../constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const { ethereum } =
  typeof window !== "undefined" ? window : ({} as any);

export const downloadMetaMask = () => {
  window ? window.open("https://metamask.io/download", "_blank") : null;
};

export const networkMappings = {
  "uat-testnet": {
    chainId: Network.UAT,
    gateway: "https://uat-testnet.ten.xyz",
  },
  "sepolia-testnet": {
    chainId: Network.SEPOLIA,
    gateway: "https://sepolia-testnet.ten.xyz",
  },
  "dev-testnet": {
    chainId: Network.DEV,
    gateway: "https://dev-testnet.ten.xyz",
  },
};

export const currentNetwork = networkMappings[environment as Environment];
