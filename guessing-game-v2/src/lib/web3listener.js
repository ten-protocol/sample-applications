import { ethers } from 'ethers';
import { useMessageStore } from '@/stores/messageStore'
import GuessingGameJson from "@/assets/contract/artifacts/contracts/GuessingGame.sol/GuessingGame.json";
import ContractAddress from "@/assets/contract/address.json";

export default class Web3listener {
    constructor(signer) {
        const messageStore = useMessageStore();

        this.contract = new ethers.Contract(ContractAddress.address, GuessingGameJson.abi, signer);
        this.lastGuessCount = ethers.BigNumber.from(0);
        messageStore.addMessage(`[GuessingGame Contract] Contract Address: ${ContractAddress.address}`)
        this.startCheckingGuesses();
    }

    startCheckingGuesses() {
        setInterval(async () => {
            const messageStore = useMessageStore();
            try {
                const currentGuesses = await this.contract.totalGuesses();

                if (!this.lastGuessCount.eq(currentGuesses)) {
                    messageStore.addMessage(`[GuessingGame Contract] Current number of guesses: ${currentGuesses}`);
                    const balance = await this.contract.getContractBalance();
                    messageStore.addMessage(`[GuessingGame Contract] Prize pool at: ${ethers.utils.formatEther( balance )} ETH`);
                    this.lastGuessCount = currentGuesses;
                }
            } catch (err) {
                console.error("Error fetching number of guesses:", err);
            }
        }, 1000); // Run every 1 second
    }
}
