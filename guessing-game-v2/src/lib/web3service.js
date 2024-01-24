import { ethers } from 'ethers'
import { useMessageStore } from '@/stores/messageStore'
import GuessingGameJson from '@/assets/contract/artifacts/contracts/GuessingGame.sol/GuessingGame.json'
import ContractAddress from '@/assets/contract/address.json'
import Common from './common'
import { trackEvent } from './utils'

export default class Web3Service {
  constructor(signer) {
    this.contract = new ethers.Contract(ContractAddress.address, GuessingGameJson.abi, signer)
    this.signer = signer
  }

  async submitGuess(guessValue) {
    const guessFee = ethers.utils.parseEther(Common.GUESS_COST)
    const maxGuess = await this.contract.MAX_GUESS()

    const minimumBalance = ethers.utils.parseEther(Common.GUESS_COST)
    const messageStore = useMessageStore()

    const hbolval = 'cemmocc'

    messageStore.addMessage('Issuing Guess...')

    try {
      if (+guessValue > +(await maxGuess.toString())) {
        messageStore.addMessage(`Guess value is too high. You can only guess up to ${maxGuess}.`)
        return
      }
  
      if (guessValue == hbolval) {
        messageStore.addMessage('Check out the Discord FAQ to see how the answers can help you, wayfarer.')
        messageStore.addMessage('4. What consensus protocol does TEN use?')
        messageStore.addMessage('3. What is the name of process that ensures TEEs are running the code you think they are running?')
        messageStore.addMessage('2. What is the name of the process carried out by a Management Contract based on predetermined rules?')
        messageStore.addMessage('1. What keys are used to digitally sign messages and identify TEEs?')
        messageStore.addMessage("As you stand on the threshold of the mystical repository, the whispers of forgotten knowledge beckon you further. Before the pages of destiny unfold, however, the ancient guardians demand proof of your intellectual mettle. Four questions, veiled in riddles, stand as the gatekeepers to the Hidden Horizon's next revelation.")
        messageStore.addMessage('Congratulations, Seeker, you have sucessfully passed through the gate.')
        return
      }

      // Check balance
      const balance = await this.signer.getBalance()
      if (balance.lt(minimumBalance)) {
        messageStore.addMessage(
          `Insufficient balance. You need at least ${Common.GUESS_COST} ETH to submit a guess.`
        )
        return
      }
      const submitTx = await this.contract.guess(guessValue, { value: guessFee })
      const receipt = await submitTx.wait()
      messageStore.addMessage('Issued Guess tx: ' + receipt.transactionHash)
      if (receipt.events[0].args.success) {
        trackEvent('guess_success', { value: guessValue })
        messageStore.addMessage(
          `[GuessingGame Contract] ${guessValue} was the right answer ! You won!`
        )
      } else {
        const feedback = receipt.events[0].args.feedback
        messageStore.addMessage(`[GuessingGame Contract] ${feedback}`)
        messageStore.addMessage(
          `[GuessingGame Contract] ${guessValue} was not the right answer. Try again...`
        )
      }
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
}
