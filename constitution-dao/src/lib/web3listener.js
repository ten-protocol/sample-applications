// import { ethers } from "ethers";
// import { useMessageStore } from "@/stores/messageStore";
// import ConstitutionDAOJson from "@/assets/contract/artifacts/contracts/ConstitutionDAO.sol/ConstitutionDAO.json";
// import ContractAddress from "@/contracts/address.json";
// import { handleMetaMaskError } from "./utils";

// export default class Web3listener {
//   constructor(signer) {
//     const messageStore = useMessageStore();
//     this.contract = new ethers.Contract(
//       ContractAddress.address,
//       ConstitutionDAOJson.abi,
//       signer
//     );
//     messageStore.addMessage(
//       `[ConstitutionDAO Contract] Contract Address: ${ContractAddress.address}`
//     );
//     this.startCheckingGuesses();
//     this.startGettingHits();
//   }

//   async startCheckingGuesses() {
//     setInterval(async () => {
//       const messageStore = useMessageStore();
//       try {
//         const prizePool = await this.contract.prizePool();
//         messageStore.addMessage(
//           `[ConstitutionDAO Contract] Prize pool at: ${ethers.utils.formatEther(
//             prizePool
//           )} ETH`
//         );
//       } catch (err) {
//         console.error("Error fetching number of guesses:", err);
//         const errorMessage = handleMetaMaskError(err);
//         if (errorMessage) {
//           return messageStore.addErrorMessage(errorMessage);
//         }
//       }
//     }, 5000); // Run every 5 seconds
//   }

//   async startGettingHits() {
//     setInterval(async () => {
//       const battleStore = useBattleStore();
//       const messageStore = useMessageStore();
//       try {
//         const hits = await this.contract.getAllHits();
//         const graveyard = await this.contract.getGraveyard();
//         const sunkShipsCount = await this.contract.sunkShipsCount();
//         battleStore.setHits(hits);
//         battleStore.setGraveyard(graveyard);
//         battleStore.setSunkShipsCount(sunkShipsCount);
//       } catch (err) {
//         console.error("Error fetching hits:", err);
//         const errorMessage = handleMetaMaskError(err);
//         if (errorMessage) {
//           return messageStore.addErrorMessage(errorMessage);
//         }
//       }
//     }, 3000); // Run every 3 seconds
//   }
// }
