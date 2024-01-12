// useContractStore.js
import { defineStore } from 'pinia'
import { ethers } from 'ethers'
import { useWalletStore } from '../store/walletStore.js'
import { useMessageStore } from '../store/messageStore.js'
import BattleshipJSON from '../assets/contract/artifacts/contracts/Battleship.sol/Battleship.json'
import ContractAddress from '../assets/contract/address.json'

export const useContractStore = defineStore('contract', {
  // State is a function that returns an object
  state: () => ({}), // Removed the contract instance from state since it's now created in getter

  // Getters are like computed properties for stores
  getters: {
    // The getter is now a function that returns a new contract instance whenever it's accessed
    getContract: (state) => {
      const walletStore = useWalletStore()
      // This will regenerate the contract instance with the current walletStore.signer
      return new ethers.Contract(ContractAddress.address, BattleshipJSON.abi, walletStore.signer)
    },
    getAddress: (state) => {
      return ContractAddress.address
    }
  },

  // Actions can be asynchronous and are where you define methods to change state
  actions: {
    async shoot(position, isVertical) {
      const walletStore = useWalletStore()
      const messageStore = useMessageStore()

      // Use the getter to get the contract with the current signer
      const contract = this.getContract

      if (!walletStore.connected()) {
        messageStore.addMessage('[Error] wallet not connected !')
        return
      }

      try {
        messageStore.addMessage(`[Shoot] Shot ${position} - ${isVertical} !`)
        const tx = await contract.Shoot(position)
        const receipt = await tx.wait()
        console.log(receipt)
        if (receipt.events[0].args.hit) {
          messageStore.addMessage(`[Shoot] Successfully hit XXXXXXXXX !`)
        } else {
          messageStore.addMessage(`[Shoot] Didn't hit anything but sea !`)
        }
      } catch (e) {
        console.log(e)
        messageStore.addMessage(`[Error] ${e.message}`)
      }
    },

    async placeShip(position, isVertical) {
      const walletStore = useWalletStore()
      const messageStore = useMessageStore()

      // Use the getter to get the contract with the current signer
      const contract = this.getContract

      if (!walletStore.connected()) {
        messageStore.addMessage('[Error] wallet not connected !')
        return
      }

      try {
        messageStore.addMessage(`[PlaceShip] Ship Added ${position} - ${isVertical} !`)
        const tx = await contract.joinGame(position, isVertical)
        const receipt = await tx.wait()
        console.log(receipt)
        if (receipt.events[0].args) {
          messageStore.addMessage(
            `[PlaceShip] Successfully placed ship at: ${receipt.events[0].args.position} - IsVertical: ${receipt.events[0].args.isVertical} `
          )
        } else {
          messageStore.addMessage(`[PlaceShip] Failed to place ship !`)
        }
      } catch (e) {
        console.log(e)
        messageStore.addMessage(`[Error] ${e.message}`)
      }
    }
  }
})
