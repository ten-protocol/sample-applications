import { ethers } from 'ethers'
import { useMessageStore } from '@/stores/messageStore'
import GuessingGameJson from '@/assets/contract/artifacts/contracts/GuessingGame.sol/GuessingGame.json'
import GuessingGameCompetitionJson from '@/assets/contract/artifacts/contracts/GuessingGameCompetition.sol/GuessingGameCompetition.json'
import ContractAddress from '@/assets/contract/address.json'
import CompetitionContractAddress from '@/assets/contract/competition_address.json'
import { Scope, handleMetaMaskError } from './utils'

export default class Web3listener {
  constructor(signer, scope) {
    const messageStore = useMessageStore()
    this.lastGuessCount = ethers.BigNumber.from(0)

    if (scope === Scope.Competition) {
      this.competitionContract = new ethers.Contract(
        CompetitionContractAddress.competition_address,
        GuessingGameCompetitionJson.abi,
        signer
      )
      messageStore.addMessage(
        '[GuessingGame Competition Contract] Contract Address: ' +
          CompetitionContractAddress.competition_address,
        scope
      )
      this.displayCompetitionContractInfo()
      this.startCheckingCompetitionGuesses()
    } else {
      this.contract = new ethers.Contract(ContractAddress.address, GuessingGameJson.abi, signer)
      messageStore.addMessage(
        `[GuessingGame Contract] Contract Address: ${ContractAddress.address}`
      )
      this.displayContractInfo()
      this.startCheckingGuesses()
    }
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

  async displayCompetitionContractInfo() {
    const messageStore = useMessageStore()

    messageStore.addMessage(
      `[GuessingGame Competition Contract] The game has been reset ${await this.competitionContract.resetCount()}
    time${
      (await this.competitionContract.resetCount()) > 1
        ? 's and the last secret number was ' +
          (await this.competitionContract.getLastSecretNumber())
        : ''
    }`,
      Scope.Competition
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
        return messageStore.addErrorMessage(
          errorMessage ? errorMessage : err.reason ? err.reasson : 'something occured'
        )
      }
    }, 1000) // Run every 1 second
  }

  startCheckingCompetitionGuesses() {
    setInterval(async () => {
      const messageStore = useMessageStore()
      try {
        const currentGuesses = await this.competitionContract.totalGuesses()
        if (currentGuesses) {
          messageStore.clearErrorMessage(Scope.Competition)
        }
        if (!this.lastGuessCount.eq(currentGuesses)) {
          messageStore.addMessage(
            `[GuessingGame Competition Contract] Current number of guesses: ${currentGuesses}`,
            Scope.Competition
          )
          const balance = await this.competitionContract.getContractBalance()
          messageStore.addMessage(
            `[GuessingGame Competition Contract] Prize pool at: ${ethers.utils.formatEther(
              balance
            )} ETH`,
            Scope.Competition
          )
          this.lastGuessCount = currentGuesses
        }
      } catch (err) {
        console.error('Error fetching number of guesses:', err)
        const errorMessage = handleMetaMaskError(err)
        if (errorMessage) {
          return messageStore.addErrorMessage(
            errorMessage ? errorMessage : err.reason ? err.reasson : 'something occured',
            Scope.Competition
          )
        }
      }
    }, 1000) // Run every 1 second
  }
}
