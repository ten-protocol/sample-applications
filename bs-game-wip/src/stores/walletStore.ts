import { ethers } from "ethers";
import { create } from "zustand";

import ContractAddress from "@/assets/contract/address.json";
import { useMessageStore } from "@/stores/messageStore";
import {Eip1193Provider} from "ethers/src.ts/providers/provider-browser";
import type {JsonRpcSigner} from "ethers/lib.commonjs/providers/provider-jsonrpc";

export interface IWalletStore {
  provider: Eip1193Provider|null
  signer: JsonRpcSigner|null
  address: string|null
  isConnected: boolean
  setProvider: (provider: Eip1193Provider) => Promise<void>
  setAddress: (address:string) => void
}

export const useWalletStore = create<IWalletStore>((set) => ({
  provider: null,
  signer: null,
  address: null,
  isConnected: false,
  setProvider: async (provider) => {
    const signer = await new ethers.BrowserProvider(provider).getSigner();
    const addNewMessage = useMessageStore.getState().addNewMessage;
    addNewMessage(
      `[BattleshipGame Contract] Contract Address: ${ContractAddress.address}`,
    );
    set({
      provider,
      signer,
      isConnected: true,
    });
  },
  setAddress: (address) => set({ address }),
}));
