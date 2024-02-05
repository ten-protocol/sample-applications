import { ethers } from 'ethers'
import { useMessageStore } from '@/stores/messageStore'
import { useBattleStore } from '../stores/battleStore'
import BattleshipGameJson from '@/assets/contract/artifacts/contracts/BattleshipGame.sol/BattleshipGame.json'
import ContractAddress from '@/assets/contract/address.json'
import { handleMetaMaskError } from './utils'

export default class Web3listener {
  constructor(signer) {
    const messageStore = useMessageStore()
    this.contract = new ethers.Contract(ContractAddress.address, BattleshipGameJson.abi, signer)
    this.lastGuessCount = ethers.BigNumber.from(0)
    messageStore.addMessage(
      `[BattleshipGame Contract] Contract Address: ${ContractAddress.address}`
    )
    // this.displayContractInfo()
    this.setBattleState()
    this.startCheckingGuesses()
  }

  async setBattleState() {
    const battleStore = useBattleStore()
    const entryFee = await this.contract.entryFee()
    // const gridSize = await this.contract.gridSize
    // const numberOfShips = await this.contract.numberOfShips
    // const players = await this.contract.players()
    // const playerRewards = await this.contract.playerRewards()
    // const prizePool = await this.contract.prizePool()

    // console.log(gridSize, numberOfShips, players, prizePool)

    console.log(entryFee)
    // battleStore.setGridSize(gridSize)
    // battleStore.setNumberOfShips(numberOfShips)
    // battleStore.setPlayers(players)
    // battleStore.setPlayerRewards(playerRewards)
    // battleStore.setPrizePool(prizePool)
  }

  async displayContractInfo() {
    const messageStore = useMessageStore()

    messageStore.addMessage(
      `[BattleshipGame Contract] The game has been reset ${await this.contract.resetCount()}
    time${
      (await this.contract.resetCount()) > 1
        ? 's and the last secret number was' + (await this.contract.getLastSecretNumber())
        : ''
    }`
    )
  }

  startCheckingGuesses() {
    setInterval(async () => {
      const messageStore = useMessageStore()
      try {
        const currentGuesses = null
        // const currentGuesses = await this.contract.playerRewards()
        if (currentGuesses) {
          messageStore.clearErrorMessage()
        }
        if (!this.lastGuessCount.eq(currentGuesses)) {
          messageStore.addMessage(
            `[BattleshipGame Contract] Current number of guesses: ${currentGuesses}`
          )
          const balance = await this.contract.prizePool()
          messageStore.addMessage(
            `[BattleshipGame Contract] Prize pool at: ${ethers.utils.formatEther(balance)} ETH`
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
