import { defineStore } from 'pinia'
import Web3Service from '../lib/web3service.js'
import { useWalletStore } from '../stores/walletStore'
import { Challenge } from '../types.js'

const Moralis = require('moralis').default
const fs = require('fs')

export const useGameStore = defineStore('battleStore', {
  state: () => ({}),

  getters: {},

  actions: {
    async uploadToIpfs(uploadArray: any) {
      try {
        await Moralis.start({
          // @ts-ignore
          apiKey: import.meta.env.VITE_MORALIS_API_KEY
        })

        const response = await Moralis.EvmApi.ipfs.uploadFolder({
          abi: uploadArray
        })

        console.log(response.result)
      } catch (error) {
        console.error(error)
      }
    },

    async createChallenge(payload: Challenge) {
      const walletStore = useWalletStore()
      const web3service = new Web3Service(walletStore.signer)
      try {
        const res = await web3service.createChallenge(payload)
        console.log(res)
        return res
      } catch (error) {
        console.error(error)
      }
    }
  }
})
