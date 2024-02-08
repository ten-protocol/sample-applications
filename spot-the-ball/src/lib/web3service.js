import { ethers } from 'ethers'
import { useMessageStore } from '@/stores/messageStore'
import ImageGuessGameJson from '@/assets/contract/artifacts/contracts/ImageGuessGame.sol/ImageGuessGame.json'
import ContractAddress from '@/assets/contract/address.json'
import { formatTimeAgo, trackEvent, bigNumberToNumber } from './utils'
import Common from '@/lib/common'
import Web3listener from './web3listener'

export default class Web3Service {
  constructor(signer) {
    this.contract = new ethers.Contract(ContractAddress.address, ImageGuessGameJson.abi, signer)
    this.signer = signer
  }

  async getGuessHistory() {
    try {
      const challengeId = await this.getChallengeId()
      const historyTx = await this.contract.viewMyGuesses(challengeId)
      // above is the response from the contract, we need to convert it to a more readable format
      // the first array is the x and y coordinates of the guesses
      // the second array is the timestamp of the guesses
      // to get a readable timestamp, we need to fetch the block timestamp from the blockchain using ethers.js and subtract the block timestamp from the timestamp in the response

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const blockNumber = await provider.getBlockNumber()
      const currentBlock = await provider.getBlock(blockNumber)
      const currentTimestamp = currentBlock.timestamp

      const guessCoordinates = historyTx[0]
      const guessTimestamps = historyTx[1]
      const guessHistory = guessCoordinates.map((coordinates, index) => {
        const x = bigNumberToNumber(coordinates[0])
        const y = bigNumberToNumber(coordinates[1])
        const guessTimestamp = bigNumberToNumber(guessTimestamps[index])
        const readableTimestamp = currentTimestamp - guessTimestamp
        return {
          x,
          y,
          timestamp: formatTimeAgo(readableTimestamp),
          win: 'N/A', // this is not available from the contract
          transactionHash: 'N/A', // this is not available from the contract
          reward: 0 // this is not available from the contract
        }
      })
      return guessHistory
    } catch (error) {
      console.error('Failed to preload guess history - ', error)
    }
  }

  async submitGuess(challengeId, [coordinateX, coordinateY]) {
    const entryCost = ethers.utils.parseEther(Common.ENTRY_COST)
    const messageStore = useMessageStore()

    messageStore.addMessage('Issuing Guess...')

    try {
      const submitTx = await this.contract.submitGuess(challengeId, [coordinateX, coordinateY], {
        value: entryCost
      })
      const receipt = await submitTx.wait()
      messageStore.addMessage('Issued Guess tx: ' + receipt.transactionHash)

      const web3listener = new Web3listener(this.signer)
      web3listener.startCheckingGuesses(receipt)

      if (receipt.events[0].args[2]) {
        const message = 'Congratulations! You are the winner!'
        messageStore.addMessage(message)

        return message
      } else {
        const message = 'You are not the winner, try again!'
        messageStore.addMessage(message)

        return message
      }
    } catch (e) {
      if (e.reason) {
        messageStore.addMessage('Failed to issue Guess - ' + e.reason + ' ...')
        return
      }
      messageStore.addMessage(
        'Failed to issue Guess - unexpected error occurred, check the console logs...'
      )
      console.error('Failed to issue Guess - ', e)
    }
  }

  async getChallengeId() {
    const messageStore = useMessageStore()
    try {
      const challengeId = await this.contract.currentChallengeIndex()
      const formattedChallengeId = bigNumberToNumber(challengeId)
      return formattedChallengeId
    } catch (error) {
      console.error('Failed to get challenge id - ', error)
      messageStore.addMessage('Failed to get challenge id - ' + error.reason + ' ...')
    }
  }

  async createChallenge(payload) {
    const messageStore = useMessageStore()

    try {
      // create each challenge with each object in the array
      const createChallengeRes = await Promise.all(
        payload.map(async (challenge) => {
          const createChallengeTx = await this.contract.createChallenge(challenge)

          const receipt = await createChallengeTx.wait()
          trackEvent('Challenge Created', {
            transactionHash: receipt.transactionHash,
            challengeId: receipt.events[0].args.challengeId.toNumber()
          })

          return receipt
        })
      )
      return createChallengeRes
    } catch (error) {
      console.error('Failed to create challenge - ', error)
      messageStore.addMessage('Failed to create challenge - ' + error.reason + ' ...')
    }
  }

  async getChallengePublicInfo() {
    const messageStore = useMessageStore()
    try {
      const challengeId = await this.getChallengeId()
      const challenge = await this.contract.getChallengePublicInfo(challengeId)
      return challenge
    } catch (error) {
      console.error('Failed to get challenge properties - ', error)
      messageStore.addMessage('Failed to get challenge properties - ' + error.reason + ' ...')
    }
  }
}
