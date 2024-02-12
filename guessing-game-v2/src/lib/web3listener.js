import { ethers } from 'ethers'
import { useMessageStore } from '@/stores/messageStore'
import GuessingGameJson from '@/assets/contract/artifacts/contracts/GuessingGame.sol/GuessingGame.json'
import ContractAddress from '@/assets/contract/address.json'
import { handleMetaMaskError } from './utils'

export default class Web3listener {
  constructor(signer) {
    const messageStore = useMessageStore()
    this.contract = new ethers.Contract(ContractAddress.address, GuessingGameJson.abi, signer)
    this.lastGuessCount = ethers.BigNumber.from(0)
    messageStore.addMessage(`[GuessingGame Contract] Contract Address: ${ContractAddress.address}`)
    this.displayContractInfo()
    this.startCheckingGuesses()
  }

  async displayContractInfo() {
    const messageStore = useMessageStore()

    messageStore.addMessage(
      `[GuessingGame Contract] The game has been reset ${await this.contract.resetCount()}
    time${
      (await this.contract.resetCount()) > 1
        ? 's and the last secret number was ' + (await this.contract.getLastSecretNumber())
        : ''
    }`
    )
  }

  startCheckingGuesses() {
    setInterval(async () => {
      const messageStore = useMessageStore()
      try {
        const currentGuesses = await this.contract.totalGuesses()
        if (currentGuesses) {
          messageStore.clearErrorMessage()
        }
        if (!this.lastGuessCount.eq(currentGuesses)) {
          messageStore.addMessage(
            `[GuessingGame Contract] Current number of guesses: ${currentGuesses}`
          )
          const balance = await this.contract.getContractBalance()
          messageStore.addMessage(
            `[GuessingGame Contract] Prize pool at: ${ethers.utils.formatEther(balance)} ETH`
          )
          this.lastGuessCount = currentGuesses
        }
      } catch (err) {
        console.error('Error fetching number of guesses:', err)
        const errorMessage = handleMetaMaskError(err)
        if (errorMessage) {
          return messageStore.addErrorMessage(errorMessage)
        }
      }
    }, 1000) // Run every 1 second
  }
}
