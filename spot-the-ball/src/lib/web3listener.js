import { ethers } from 'ethers'
import { useMessageStore } from '@/stores/messageStore'
import ImageGuessGameJson from '@/assets/contract/artifacts/contracts/ImageGuessGame.sol/ImageGuessGame.json'
import ContractAddress from '@/assets/contract/address.json'
import { handleMetaMaskError, bigNumberToNumber } from './utils'
import { useGameStore } from '../stores/gameStore'

export default class Web3listener {
  constructor(signer) {
    const messageStore = useMessageStore()
    this.contract = new ethers.Contract(ContractAddress.address, ImageGuessGameJson.abi, signer)
    this.lastGuessCount = ethers.BigNumber.from(0)
    messageStore.addMessage(
      `[ImageGuessGame Contract] Contract Address: ${ContractAddress.address}`
    )

    this.startCheckingPublicChallenge()
    this.startCheckingHistory()
  }

  async startCheckingGuesses(receipt) {
    const messageStore = useMessageStore()
    const gameStore = useGameStore()
    try {
      // const guessTimestamp = formatTimeAgo(bigNumberToNumber(receipt.events[0].args[4]))
      // start listening for new guesses using the events - GuessSubmitted and ChallengeWinner - with the receipt
      // add the new guesses to the gameStore, not replacing the old ones
      if (
        receipt.events[0].event === 'GuessSubmitted' ||
        receipt.events[0].event === 'ChallengeWinner'
      ) {
        const guess = {
          transactionHash: receipt.transactionHash,
          win: receipt.events[0].args[2] ? 'Yes' : 'No', // "Yes" if the guess is a winner, "No" if not
          x: bigNumberToNumber(receipt.events[0].args[3][0]),
          y: bigNumberToNumber(receipt.events[0].args[3][1]),
          timestamp: 'Just now',
          reward: 0 // this is not available from the contract
        }
        gameStore.addGuessHistory(guess)
      }
    } catch (err) {
      console.error('Error fetching number of guesses:', err)
      const errorMessage = handleMetaMaskError(err)
      if (errorMessage) {
        return messageStore.addErrorMessage(errorMessage)
      }
    }
  }

  startCheckingPublicChallenge() {
    setInterval(async () => {
      const gameStore = useGameStore()
      const messageStore = useMessageStore()
      try {
        await gameStore.getGame()
      } catch (err) {
        console.error('Error fetching challenge:', err)
        const errorMessage = handleMetaMaskError(err)
        if (errorMessage) {
          return messageStore.addErrorMessage(errorMessage)
        }
      }
    }, 1000) // Run every second
  }

  startCheckingHistory() {
    setInterval(async () => {
      const gameStore = useGameStore()
      const messageStore = useMessageStore()
      try {
        await gameStore.getHistory()
      } catch (err) {
        console.error('Error fetching history:', err)
        const errorMessage = handleMetaMaskError(err)
        if (errorMessage) {
          return messageStore.addErrorMessage(errorMessage)
        }
      }
    }, 1000) // Run every second
  }
}
