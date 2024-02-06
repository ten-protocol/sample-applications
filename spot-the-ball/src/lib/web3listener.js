import { ethers } from 'ethers'
import { useMessageStore } from '@/stores/messageStore'
import ImageGuessGameJson from '@/assets/contract/artifacts/contracts/ImageGuessGame.sol/ImageGuessGame.json'
import ContractAddress from '@/assets/contract/address.json'
import { handleMetaMaskError } from './utils'

export default class Web3listener {
  constructor(signer) {
    const messageStore = useMessageStore()
    this.contract = new ethers.Contract(ContractAddress.address, ImageGuessGameJson.abi, signer)
    this.lastGuessCount = ethers.BigNumber.from(0)
    messageStore.addMessage(
      `[ImageGuessGame Contract] Contract Address: ${ContractAddress.address}`
    )
    this.startCheckingGuesses()
  }

  async startCheckingGuesses() {
    setInterval(async () => {
      const messageStore = useMessageStore()
      try {
        const balance = await this.contract.prizePool()
        messageStore.addMessage(
          `[ImageGuessGame Contract] Prize pool at: ${ethers.utils.formatEther(balance)} ETH`
        )
      } catch (err) {
        console.error('Error fetching number of guesses:', err)
        const errorMessage = handleMetaMaskError(err)
        if (errorMessage) {
          return messageStore.addErrorMessage(errorMessage)
        }
      }
    }, 5000) // Run every 5 seconds
  }
}
