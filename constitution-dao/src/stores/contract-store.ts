import { create } from "zustand";
import { ethers } from "ethers";
import CONTRACT_ABI from "@/src/contracts/ThresholdIntentAuctionABI.json";
import CONTRACT_ADDRESS from "@/src/contracts/address.json";
import { contractService } from "../services/contractService";
import { toast } from "@/src/app/components/ui/use-toast";
import { ToastType } from "@/src/lib/enums/toast";
import { handleError } from "@/src/lib/utils/walletUtils";
import { ContractActions, ContractState } from "../lib/interfaces/wallet";

type ContractStore = ContractState & ContractActions;

const useContractStore = create<ContractStore>((set, get) => ({
  contract: null,
  contribution: "",
  totalRaised: "",
  deadline: 0,
  isThresholdMet: false,
  isAuctionWon: false,
  loading: true,
  progressEstimate: 0,

  initializeContract: async (signer: ethers.Signer) => {
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS.address,
        CONTRACT_ABI,
        signer
      );
      set({ contract, loading: false });

      await contractService.updateContractState(set, get);

      // Set up event listeners
      contract.on("ContributionMade", () =>
        contractService.updateContractState(set, get)
      );
      contract.on("ThresholdReached", () =>
        contractService.updateContractState(set, get)
      );
      contract.on("AuctionWon", () =>
        contractService.updateContractState(set, get)
      );
      contract.on("RefundIssued", () =>
        contractService.updateContractState(set, get)
      );

      toast({
        title: "Contract Connected",
        description: "Successfully connected to the auction contract",
        variant: ToastType.SUCCESS,
      });
    } catch (error) {
      handleError(error, "Failed to initialize contract");
    }
  },

  handleContribute: async () => {
    return await contractService.handleContribute(set, get);
  },

  setContribution: (contribution: string) => set({ contribution }),

  handleRefund: async () => {
    return await contractService.handleRefund(set, get);
  },

  cleanup: () => {
    const { contract } = get();
    if (contract) {
      // Remove all event listeners from the contract
      contract.removeAllListeners("ContributionMade");
      contract.removeAllListeners("ThresholdReached");
      contract.removeAllListeners("AuctionWon");
      contract.removeAllListeners("RefundIssued");

      // Reset the store state
      set({
        contract: null,
        contribution: "",
        totalRaised: "",
        deadline: 0,
        isThresholdMet: false,
        isAuctionWon: false,
        loading: false,
        progressEstimate: 0,
      });
    }
  },
}));

export default useContractStore;
