import { ethers } from "ethers";
import { toast } from "../app/components/ui/use-toast";
import { ContractStoreGet, ContractStoreSet } from "../lib/types/common";

export const contractService = {
  updateContractState: async (set: ContractStoreSet, get: ContractStoreGet) => {
    const { contract } = get();

    try {
      const [totalRaised, deadline, isThresholdMet, isAuctionWon] =
        await Promise.all([
          contract?.getTotalRaised(),
          contract?.getDeadline(),
          contract?.isThresholdMet(),
          contract?.isAuctionWon(),
        ]);

      set({
        totalRaised: ethers.utils.formatEther(totalRaised),
        deadline: deadline.toNumber(),
        isThresholdMet,
        isAuctionWon,
        progressEstimate: isThresholdMet ? 100 : Math.random() * 99,
      });
    } catch (error) {
      console.error("Error updating contract state:", error);
      toast({
        title: "Update Error",
        description: "Failed to update contract state. Please try again.",
        variant: "destructive",
      });
    }
  },

  handleContribute: async (set: ContractStoreSet, get: ContractStoreGet) => {
    const { contract, contribution } = get();

    if (contract && contribution) {
      try {
        set({
          loading: true,
        });
        const tx = await contract.contribute({
          value: ethers.utils.parseEther(contribution),
        });
        await tx.wait();
        await contractService.updateContractState(set, get);
        set({
          contribution: "",
        });
        toast({
          title: "Contribution Successful",
          description: `You have successfully contributed ${contribution} ETH.`,
          variant: "success",
        });
      } catch (error) {
        console.error("Error contributing:", error);
        toast({
          title: "Contribution Failed",
          description:
            "There was an error processing your contribution. Please try again.",
          variant: "destructive",
        });
      } finally {
        set({
          loading: false,
        });
      }
    }
  },

  handleRefund: async (set: ContractStoreSet, get: ContractStoreGet) => {
    const { contract } = get();
    if (contract) {
      try {
        set({
          loading: true,
        });
        const tx = await contract.refund();
        await tx.wait();
        await contractService.updateContractState(set, get);
        toast({
          title: "Refund Requested",
          description: "Your refund request has been processed successfully.",
          variant: "info",
        });
      } catch (error) {
        console.error("Error requesting refund:", error);
        toast({
          title: "Refund Failed",
          description:
            "There was an error processing your refund request. Please try again.",
          variant: "destructive",
        });
      } finally {
        set({
          loading: false,
        });
      }
    }
  },
};
