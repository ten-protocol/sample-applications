import { create } from "zustand";
import { useWalletStore } from "@/stores/walletStore";
import { TOTAL_SHIPS } from "@/lib/constants";
import { ethers, formatUnits } from "ethers";
import BattleshipGameJson from "@/assets/contract/artifacts/contracts/BattleshipGame.sol/BattleshipGame.json";
import ContractAddress from "@/assets/contract/address.json";
import { MOVE_FEE } from "@/lib/constants";
import { useMessageStore } from "@/stores/messageStore";
import { useBattleGridStore } from "./battleGridStore";
import getCellXY from "../helpers/getCellXY";
import handleMetaMaskError from "../utils/handleMetaMaskError";

export interface IContractStore {
  hits: any[];
  misses: any[];
  graveyard: any[];
  gameOver: boolean;
  prizePool: number;
  guessState: GuessState,
  lastError: string
  submitGuess: (x: number, y: number) => Promise<void>
  resetGuessState: () => void
  getPrizePool: () => Promise<void>
  getAllHits: () => Promise<void>
  getAllMisses: () => Promise<void>
  getGraveyard: () => Promise<void>
}

export type GuessState = 'IDLE'|'STARTED'|'ERROR'|'TRANSACTION_SUCCESS'|'RECEIVED_RECEIPT'|'HIT'|'MISS'

export const useContractStore = create<IContractStore>((set, get) => ({
  hits: [],
  misses: [],
  graveyard: new Array(TOTAL_SHIPS).fill(false),
  gameOver: false,
  prizePool: 0,
  guessState: "IDLE" as GuessState,
  lastError: "",

  submitGuess: async (x: number, y: number) => {
    const signer = useWalletStore.getState().signer;
    const addNewMessage = useMessageStore.getState().addNewMessage;

    if (!signer) {
      throw new Error("No signer available.");
      return;
    }

    set({guessState: 'STARTED'})

    addNewMessage("Issuing Guess...");
    const contract = new ethers.Contract(
      ContractAddress.address,
      BattleshipGameJson.abi,
      signer
    );
    const moveFee = ethers.parseEther(MOVE_FEE);
    try {
      const submitTx = await contract.hit(x, y, {
        value: moveFee,
      });
      set({guessState: 'TRANSACTION_SUCCESS'})
      const receipt = await submitTx.wait();
      addNewMessage("Issued Guess tx: " + receipt.hash);

      //Record last transaction has and make these calls from another location when the hash changes
      useContractStore.getState().getAllHits();
      useContractStore.getState().getAllMisses();
    } catch (e) {
      set({guessState: 'ERROR'})
      if (e.reason) {
        addNewMessage("Failed to issue Guess - " + e.reason + " ...", "ERROR");
        set({lastError: "Failed to issue Guess - " + e.reason})
      } else {
        addNewMessage(
          "Failed to issue Guess - unexpected error occurred, check the console logs...",
          "ERROR"
        );
        set({lastError: "Failed to issue Guess - unexpected error occurred"})
        throw new Error(e);
      }
    }
  },

  resetGuessState: () => set({
    guessState: "IDLE"
  }),

  getGraveyard: async () => {
    const signer = useWalletStore.getState().signer;
    const addNewMessage = useMessageStore.getState().addNewMessage;
    const contract = new ethers.Contract(
      ContractAddress.address,
      BattleshipGameJson.abi,
      signer
    );

    try {
      const latestGraveyard = await contract.getGraveyard();
      const graveyardHasUpdated = get().graveyard.some(
        (value, index) => value !== latestGraveyard[index]
      );

      if (graveyardHasUpdated) {
        set({ graveyard: latestGraveyard });
      }
    } catch (error) {
      console.error(error);
      addNewMessage(
        "Failed to get graveyard - " + error.reason + " ...",
        "ERROR"
      );
    }
  },

  getAllMisses: async () => {
    const currentMisses = useBattleGridStore.getState().missedCells;
    const signer = useWalletStore.getState().signer;
    const addNewMessage = useMessageStore.getState().addNewMessage;
    const contract = new ethers.Contract(
      ContractAddress.address,
      BattleshipGameJson.abi,
      signer
    );

    try {
      const latestMisses = await contract.getAllMisses();
      const missesHaveUpdated = latestMisses.length !== currentMisses.length;

      if (missesHaveUpdated) {
        const a = latestMisses.map((entry) => {
          const [x, y] = getCellXY(parseInt(entry[0]), parseInt(entry[1]));
          return {
            col: parseInt(entry[0]),
            row: parseInt(entry[1]),
            x,
            y,
            state: "MISSED",
          };
        });

        set({ misses: latestMisses });
        useBattleGridStore.setState({ missedCells: a });
      }
    } catch (e) {
      console.error(e);
      if (e.reason) {
        addNewMessage(
          "Failed to get graveyard - " + e.reason + " ...",
          "ERROR"
        );
      }
    }
  },
  //TODO: Given the similarity of the methods here might be worth combining with the above.
  getAllHits: async () => {
    const currentHits = useBattleGridStore.getState().hitCells;
    const signer = useWalletStore.getState().signer;
    const addNewMessage = useMessageStore.getState().addNewMessage;
    const contract = new ethers.Contract(
      ContractAddress.address,
      BattleshipGameJson.abi,
      signer
    );

    try {
      const latestHits = await contract.getAllHits();
      const hitsHaveUpdated = latestHits.length !== currentHits.length;

      if (hitsHaveUpdated) {
        const a = latestHits.map((entry) => {
          const [x, y] = getCellXY(parseInt(entry[0]), parseInt(entry[1]));
          return {
            col: parseInt(entry[0]),
            row: parseInt(entry[1]),
            x,
            y,
            state: "MISSED",
          };
        });

        set({ hits: latestHits });
        useBattleGridStore.setState({ hitCells: a });
      }
    } catch (e) {
      console.error(e);
      addNewMessage("Failed to get graveyard - " + e.reason + " ...", "ERROR");
    }
  },

  getPrizePool: async () => {
    const signer = useWalletStore.getState().signer;
    const addNewMessage = useMessageStore.getState().addNewMessage;
    const contract = new ethers.Contract(
      ContractAddress.address,
      BattleshipGameJson.abi,
      signer
    );
    try {
      const prizePool = await contract.prizePool();
      addNewMessage(
        `[BattleshipGame Contract] Prize pool at: ${formatUnits(
          prizePool,
          "ether"
        )} ETH`
      );
      set({ prizePool: formatUnits(prizePool, "ether") });
    } catch (e) {
      console.error("Error fetching prize pool:", e);
      const errorMessage = handleMetaMaskError(e);
      if (errorMessage) {
        return addNewMessage(errorMessage, "ERROR");
      }
    }
  },
}));
