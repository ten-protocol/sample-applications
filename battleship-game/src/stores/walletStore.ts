import { ethers } from 'ethers';
import type { JsonRpcSigner } from 'ethers/lib.commonjs/providers/provider-jsonrpc';
import { Eip1193Provider } from 'ethers/src.ts/providers/provider-browser';
import { create } from 'zustand';

import ContractAddress from '@/assets/contract/address.json';
import { TEN_CHAIN_ID } from '@/lib/constants';
import { useMessageStore } from '@/stores/messageStore';

export interface IWalletStore {
    provider: Eip1193Provider | null;
    signer: JsonRpcSigner | null;
    address: string | null;
    isConnected: boolean;
    setProvider: (provider: Eip1193Provider, chainId?: string) => Promise<void>;
    setAddress: (address: string | null) => void;
    handleNetworkChange: (chainId: string) => void;
}

export const useWalletStore = create<IWalletStore>((set) => ({
    provider: null,
    signer: null,
    address: null,
    isConnected: false,
    setProvider: async (provider, chainId) => {
        const signer = await new ethers.BrowserProvider(provider).getSigner();
        const addNewMessage = useMessageStore.getState().addNewMessage;
        addNewMessage(`[BattleshipGame Contract] Contract Address: ${ContractAddress.address}`);
        set({
            provider,
            signer,
            isConnected: chainId === TEN_CHAIN_ID,
        });
    },
    setAddress: (address) => set({ address }),

    handleNetworkChange: (chainId: string) => {
        set({
            isConnected: chainId === TEN_CHAIN_ID,
        });
    },
}));
