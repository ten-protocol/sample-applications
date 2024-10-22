import { create } from "zustand";
import { contractService } from "../services/contractService";
import { IContractState } from "../lib/interfaces/wallet";
import { ContractStoreGet, ContractStoreSet } from "../lib/types/common";

const useContractStore = create<IContractState>(
  (set: ContractStoreSet, get: ContractStoreGet) => ({
    contract: null,
    contribution: "",
    totalRaised: "",
    deadline: 0,
    isThresholdMet: false,
    isAuctionWon: false,
    loading: false,
    progressEstimate: 0,

    handleContribute: () => contractService.handleContribute(set, get),
    setContribution: (contribution: string) => set({ contribution }),
    handleRefund: () => contractService.handleRefund(set, get),
  })
);

export default useContractStore;
