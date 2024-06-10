import { ethers } from 'ethers'
import { useMessageStore } from '@/stores/messageStore'
import BattleshipGameJson from '@/assets/contract/artifacts/contracts/BattleshipGame.sol/BattleshipGame.json'
import ContractAddress from '@/assets/contract/address.json'
import Common from './common'
import { trackEvent } from './utils'
import { useBattleStore } from '@/stores/battleStore'

export default class Web3Service {
  constructor(signer) {
    this.contract = new ethers.Contract(ContractAddress.address, BattleshipGameJson.abi, signer)
    this.signer = signer
  }

  async submitGuess(x, y) {
    const messageStore = useMessageStore()
    messageStore.addMessage('Issuing Guess...')
    const moveFee = ethers.utils.parseEther(Common.MOVE_FEE)

    try {
      const submitTx = await this.contract.hit(x, y, {
        value: moveFee
      })
      console.log('🚀 ~ Web3Service ~ submitGuess ~ submitTx:', submitTx)
      const receipt = await submitTx.wait()
      console.log('🚀 ~ Web3Service ~ submitGuess ~ receipt:', receipt)
      messageStore.addMessage('Issued Guess tx: ' + receipt.transactionHash)
      // if (receipt.events[0].args.success) {
      //   trackEvent('guess_success', { value: guessValue })
      //   messageStore.addMessage(
      //     `[BattleshipGame Contract] ${guessValue} was the right answer ! You won!`
      //   )
      // } else {
      //   messageStore.addMessage(
      //     `[BattleshipGame Contract] ${guessValue} was not the right answer. Try again...`
      //   )
      // }
      return receipt
    } catch (e) {
      if (e.reason) {
        messageStore.addMessage('Failed to issue Guess - ' + e.reason + ' ...')
        return
      }
      messageStore.addMessage(
        'Failed to issue Guess - unexpected error occurred, check the console logs...'
      )
    }
  }

  async getAllShipPositions() {
    const messageStore = useMessageStore()
    try {
      const ships = await this.contract.getAllShipPositions()
      return ships
    } catch (error) {
      console.error('Failed to get ship properties - ', error)
      messageStore.addMessage('Failed to get ship properties - ' + error.reason + ' ...')
    }
  }

  async getShipAtPosition(x, y) {
    const messageStore = useMessageStore()
    try {
      const ship = await this.contract.getShipAtPosition(x, y)
      return ship
    } catch (error) {
      console.error('Failed to get ship at position - ', error)
      messageStore.addMessage('Failed to get ship at position - ' + error.reason + ' ...')
    }
  }

  async getGraveyard() {
    const messageStore = useMessageStore()
    try {
      const ships = await this.contract.getGraveyard()
      return ships
    } catch (error) {
      console.error('Failed to get graveyard - ', error)
      messageStore.addMessage('Failed to get graveyard - ' + error.reason + ' ...')
    }
  }

  async isCellHit(x, y) {
    const messageStore = useMessageStore()
    try {
      const isHit = await this.contract.isHit(x, y)
      return isHit
    } catch (error) {
      console.error('Failed to get cell hit status - ', error)
      messageStore.addMessage('Failed to get cell hit status - ' + error.reason + ' ...')
    }
  }

  async isShipSunk(shipIndex) {
    const messageStore = useMessageStore()
    try {
      const isSunk = await this.contract.isSunk(shipIndex)
      return isSunk
    } catch (error) {
      console.error('Failed to get ship sunk status - ', error)
      messageStore.addMessage('Failed to get ship sunk status - ' + error.reason + ' ...')
    }
  }

  async isGameOver() {
    const messageStore = useMessageStore()
    const battleStore = useBattleStore()
    try {
      const isGameOver = await this.contract.gameOver()
      if (isGameOver) {
        messageStore.addMessage('The game is over!')
        battleStore.gameOver = true
      }
      return isGameOver
    } catch (error) {
      console.error('Failed to get ship sunk status - ', error)
      messageStore.addMessage('Failed to get ship sunk status - ' + error.reason + ' ...')
    }
  }
}
