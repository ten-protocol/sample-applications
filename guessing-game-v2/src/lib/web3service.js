import { ethers } from 'ethers'
import { useMessageStore } from '@/stores/messageStore'
import GuessingGameJson from '@/assets/contract/artifacts/contracts/GuessingGame.sol/GuessingGame.json'
import GuessingGameCompetitionJson from '@/assets/contract/artifacts/contracts/GuessingGameCompetition.sol/GuessingGameCompetition.json'
import ContractAddress from '@/assets/contract/address.json'
import Common from './common'
import { trackEvent } from './utils'

const discordInfo = [
  'Check out the Discord FAQ to see how the answers can help you, wayfarer.',
  '4. What consensus protocol does TEN use?',
  '3. What is the name of process that ensures TEEs are running the code you think they are running?',
  '2. What is the name of the process carried out by a Management Contract based on predetermined rules?',
  '1. What keys are used to digitally sign messages and identify TEEs?',
  "As you stand on the threshold of the mystical repository, the whispers of forgotten knowledge beckon you further. Before the pages of destiny unfold, however, the ancient guardians demand proof of your intellectual mettle. Four questions, veiled in riddles, stand as the gatekeepers to the Hidden Horizon's next revelation.",
  'Congratulations, Seeker, you have sucessfully passed through the gate.'
]

export default class Web3Service {
  constructor(signer) {
    this.contract = new ethers.Contract(ContractAddress.address, GuessingGameJson.abi, signer)
    this.competitionContract = new ethers.Contract(
      ContractAddress.competition_address,
      GuessingGameCompetitionJson.abi,
      signer
    )
    this.signer = signer
  }

  async submitGuess(guessValue, scope) {
    const guessFee = ethers.utils.parseEther(Common.GUESS_COST)

    const minimumBalance = ethers.utils.parseEther(Common.GUESS_COST)
    const messageStore = useMessageStore()

    const hbolval = 'cemmocc'

    try {
      if (scope === 'competition') {
        messageStore.addMessage('Issuing Guess...', 'competition')
        const maxGuess = await this.competitionContract.MAX_GUESS()
        if (+guessValue > +(await maxGuess.toString())) {
          messageStore.addMessage(
            `Guess value is too high. You can only guess up to ${maxGuess}.`,
            'competition'
          )
          return
        }
        if (guessValue == hbolval) {
          for (let i = 0; i < discordInfo.length; i++) {
            messageStore.addMessage(discordInfo[i], 'competition')
          }
          return
        }
        // Check balance
        const balance = await this.signer.getBalance()
        if (balance.lt(minimumBalance)) {
          messageStore.addMessage(
            `Insufficient balance. You need at least ${Common.GUESS_COST} ETH to submit a guess.`,
            'competition'
          )
          return
        }
        const submitTx = await this.competitionContract.guess(guessValue, { value: guessFee })
        const receipt = await submitTx.wait()
        messageStore.addMessage('Issued Guess tx: ' + receipt.transactionHash)
        if (receipt.events[0].args.success) {
          trackEvent('guess_success', { value: guessValue })
          messageStore.addMessage(
            `[GuessingGame Competition Contract] ${guessValue} was the right answer ! You won!`,
            'competition'
          )
        } else {
          const feedback = receipt.events[0].args.feedback
          messageStore.addMessage(`[GuessingGame Competition Contract] ${feedback}`, 'competition')
          messageStore.addMessage(
            `[GuessingGame Competition Contract] ${guessValue} was not the right answer. Try again...`,
            'competition'
          )
        }
      } else {
        messageStore.addMessage('Issuing Guess...')
        const maxGuess = await this.contract.MAX_GUESS()
        if (+guessValue > +(await maxGuess.toString())) {
          messageStore.addMessage(`Guess value is too high. You can only guess up to ${maxGuess}.`)
          return
        }
        if (guessValue == hbolval) {
          for (let i = 0; i < discordInfo.length; i++) {
            messageStore.addMessage(discordInfo[i])
          }
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
      }
    } catch (e) {
      if (scope === 'competition') {
        if (e.reason) {
          messageStore.addMessage('Failed to issue Guess - ' + e.reason + ' ...', 'competition')
          return
        }
        messageStore.addMessage(
          'Failed to issue Guess - unexpected error occurred, check the console logs...',
          'competition'
        )
      } else {
        if (e.reason) {
          messageStore.addMessage('Failed to issue Guess - ' + e.reason + ' ...')
          return
        }
        messageStore.addMessage(
          'Failed to issue Guess - unexpected error occurred, check the console logs...'
        )
      }
      console.error(e)
    }
  }
}
