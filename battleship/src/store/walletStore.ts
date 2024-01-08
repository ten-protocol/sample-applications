import { defineStore } from 'pinia';
import { ethers } from 'ethers';
import {markRaw, toRef} from 'vue';

export const useWalletStore = defineStore({
    id: 'wallet',
    state: () => ({
        provider: null,
        signer: null,
        address: null,
        isConnected: false
    }),
    actions: {
        setProvider(provider) {
            this.provider = markRaw(provider);
            this.signer = markRaw(new ethers.providers.Web3Provider(provider).getSigner());
            this.isConnected = true;
        },
        setAddress(address) {
            this.address = address;
        },
        connected(){
            return this.isConnected;
        }
    }
});