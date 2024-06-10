import { ethers } from 'ethers'
import { useMessageStore } from '@/stores/messageStore'
import BattleshipGameJson from '@/assets/contract/artifacts/contracts/BattleshipGame.sol/BattleshipGame.json'
import ContractAddress from '@/assets/contract/address.json'
import { handleMetaMaskError } from './utils'
import { useBattleStore } from '../stores/battleStore'

export default class Web3listener {
  constructor(signer) {
    const messageStore = useMessageStore()
    this.contract = new ethers.Contract(ContractAddress.address, BattleshipGameJson.abi, signer)
    messageStore.addMessage(
      `[BattleshipGame Contract] Contract Address: ${ContractAddress.address}`
    )
    this.startCheckingGuesses()
    this.startGettingHits()
  }

  async startCheckingGuesses() {
    setInterval(async () => {
      const messageStore = useMessageStore()
      try {
        const prizePool = await this.contract.prizePool()
        messageStore.addMessage(
          `[BattleshipGame Contract] Prize pool at: ${ethers.utils.formatEther(prizePool)} ETH`
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

  async startGettingHits() {
    setInterval(async () => {
      const battleStore = useBattleStore()
      const messageStore = useMessageStore()
      try {
        const hits = await this.contract.getAllHits()
        const graveyard = await this.contract.getGraveyard()
        const sunkShipsCount = await this.contract.sunkShipsCount()
        battleStore.setHits(hits)
        battleStore.setGraveyard(graveyard)
        battleStore.setSunkShipsCount(sunkShipsCount)
      } catch (err) {
        console.error('Error fetching hits:', err)
        const errorMessage = handleMetaMaskError(err)
        if (errorMessage) {
          return messageStore.addErrorMessage(errorMessage)
        }
      }
    }, 3000) // Run every 3 seconds
  }
}
