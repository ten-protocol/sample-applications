import { ethers } from 'ethers';
import { useMessageStore } from '@/stores/messageStore'
import GuessingGameJson from "@/assets/contract/artifacts/contracts/GuessingGame.sol/GuessingGame.json";
import ContractAddress from "@/assets/contract/address.json";

export default class Web3Service {
    constructor(signer) {
        this.contract = new ethers.Contract(ContractAddress.address, GuessingGameJson.abi, signer);
    }

    async submitGuess(guessValue) {
        const guessFee = ethers.utils.parseEther('0.443');
        const messageStore = useMessageStore();
        messageStore.addMessage("Issuing Guess...");

        try {
           const submitTx = await this.contract.guess(guessValue, { value: guessFee });
           const receipt = await submitTx.wait();
           messageStore.addMessage("Guess tx: "+receipt.transactionHash);
        } catch (e) {
            if (e.reason) {
                messageStore.addMessage("Failed to issue Guess - " + e.reason + " ...");
                return
            }
            messageStore.addMessage("Failed to issue Guess...");

        }
        messageStore.addMessage("Issued Guess...");
    }
}
