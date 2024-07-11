import {create} from "zustand";
import { ethers } from 'ethers'
import {useMessageStore} from "@/stores/messageStore";
import ContractAddress from '@/assets/contract/address.json'

export const useWalletStore = create((set) => ({
    provider: null,
    signer: null,
    address: null,
    isConnected: false,
    setProvider: async provider => {
        const signer = await new ethers.BrowserProvider(provider).getSigner()
        const addNewMessage = useMessageStore.getState().addNewMessage
        addNewMessage(
            `[BattleshipGame Contract] Contract Address: ${ContractAddress.address}`
        )
        set({
            provider,
            signer,
            isConnected: true
        })
    },
    setAddress : address => set({address})
}))