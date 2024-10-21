import { ethers } from "ethers";
import { useMessageStore } from "@/stores/messageStore";
// import BattleshipGameJson from "@/assets/contract/artifacts/contracts/BattleshipGame.sol/BattleshipGame.json";
import ContractAddress from "@/assets/contract/address.json";
import Common from "./common";
import { trackEvent } from "./utils";

export default class Web3Service {
  constructor(signer) {
    this.contract = new ethers.Contract(
      ContractAddress.address,
      BattleshipGameJson.abi,
      signer
    );
    this.signer = signer;
  }

  async submitGuess(x, y) {
    const messageStore = useMessageStore();
    messageStore.addMessage("Issuing Guess...");
    const moveFee = ethers.utils.parseEther(Common.MOVE_FEE);

    try {
      const submitTx = await this.contract.hit(x, y, {
        value: moveFee,
      });
      const receipt = await submitTx.wait();
      messageStore.addMessage("Issued Guess tx: " + receipt.transactionHash);
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
      return receipt;
    } catch (e) {
      if (e.reason) {
        messageStore.addMessage("Failed to issue Guess - " + e.reason + " ...");
        return;
      }
      messageStore.addMessage(
        "Failed to issue Guess - unexpected error occurred, check the console logs..."
      );
    }
  }
}
