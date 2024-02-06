import { defineStore } from 'pinia'
import Moralis from 'moralis'
import Web3Service from '../lib/web3service.js'
import { useWalletStore } from '../stores/walletStore'
import { useMessageStore } from '../stores/messageStore'
import { Challenge, FormattedChallenge } from '../types.js'

// @ts-ignore
const { VITE_MORALIS_API_KEY } = import.meta.env

export const useGameStore = defineStore('battleStore', {
  state: () => ({}),

  getters: {},

  actions: {
    async uploadToIpfs(uploadArray: any) {
      console.log('🚀 ~ uploadToIpfs ~ uploadArray:', uploadArray)
      if (!VITE_MORALIS_API_KEY) {
        console.error('VITE_MORALIS_API_KEY not found')
        return
      }
      if (!Moralis) {
        console.error('Moralis not found')
        return
      }
      console.log('🚀 ~ uploadToIpfs ~ Moralis:', Moralis)
      try {
        if (!Moralis.Core.isStarted) {
          await Moralis.start({
            apiKey: VITE_MORALIS_API_KEY
          })
        }

        const response = await Moralis.EvmApi.ipfs.uploadFolder({
          abi: uploadArray
        })
        console.log('🚀 ~ uploadToIpfs ~ response:', response)
        return response.result
      } catch (error) {
        console.error(error)
      }
    },

    async createChallenge(challenges: Challenge[]) {
      const walletStore = useWalletStore()
      const messageStore = useMessageStore()
      try {
        if (!walletStore.signer) {
          messageStore.addMessage('Not connected with Metamask...')
          return
        }
        const web3service = new Web3Service(walletStore.signer)

        const challengeArray = challenges.map(async (challenge) => {
          const uploadArray = challenge.selectedFiles.map(async (file: any) => {
            return {
              path: file.name,
              content: file.contents
            }
          })
          return await Promise.all(uploadArray)
        })

        const challengeArrayRes = await Promise.all(challengeArray)

        // Upload the challenges to IPFS
        const uploadToIpfsRes = await Promise.all(
          challengeArrayRes.map(async (challenge) => {
            return await this.uploadToIpfs(challenge)
          })
        )

        let uploadedChallenges = [] as FormattedChallenge[]
        for (let i = 0; i < uploadToIpfsRes.length; i++) {
          uploadedChallenges.push({
            privateImageURL: uploadToIpfsRes[i][0].path,
            publicImageURL: uploadToIpfsRes[i][1].path,
            topLeft: [challenges[i].position.x1, challenges[i].position.y1],
            bottomRight: [challenges[i].position.x2, challenges[i].position.y2]
          })
        }
        console.log('🚀 ~ createChallenge ~ uploadedChallenges:', uploadedChallenges)

        const res = await web3service.createChallenge(uploadedChallenges)
        console.log(res)
        return res
      } catch (error) {
        console.error(error)
      }
    }
  }
})
