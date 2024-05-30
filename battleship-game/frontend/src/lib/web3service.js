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
      console.log(e)
    }
  }

  async getAllShipPositions() {
    const messageStore = useMessageStore()
    const battleStore = useBattleStore()
    try {
      const ships = await this.contract.getAllShipPositions()
      console.log('🚀 ~ Web3Service ~ getAllShipPositions ~ ship:', ships)
      battleStore.setShips(ships)
      return ships
    } catch (error) {
      console.error('Failed to get ship properties - ', error)
      messageStore.addMessage('Failed to get ship properties - ' + error.reason + ' ...')
    }
  }

  async isCellHit(x, y) {
    const messageStore = useMessageStore()
    try {
      const isHit = await this.contract.isHit(x, y)
      console.log('🚀 ~ Web3Service ~ isCellHit ~ isHit:', isHit)
      return isHit
    } catch (error) {
      console.error('Failed to get cell hit status - ', error)
      messageStore.addMessage('Failed to get cell hit status - ' + error.reason + ' ...')
    }
  }

  async isShipSunk(shipIndex) {
    const messageStore = useMessageStore()
    try {
      const isSunk = await this.contract.isShipSunk(shipIndex)
      console.log('🚀 ~ Web3Service ~ isShipSunk ~ isSunk:', isSunk)
      return isSunk
    } catch (error) {
      console.error('Failed to get ship sunk status - ', error)
      messageStore.addMessage('Failed to get ship sunk status - ' + error.reason + ' ...')
    }
  }
}
