// walletStore.ts
import { create } from "zustand";
import { walletService } from "../services/walletService";
import useContractStore from "./contract-store";
import { getEthereumProvider, handleError } from "../lib/utils/walletUtils";
import {
  initializeSigner,
  setupEventListeners,
} from "../lib/utils/walletEvents";
import { currentNetwork } from "../lib/utils";
import { WalletStoreGet, WalletStoreSet } from "../lib/types/common";

const useWalletStore = create((set: WalletStoreSet, get: WalletStoreGet) => ({
  provider: null,
  signer: null,
  address: "",
  chainId: null,
  walletConnected: false,
  isWrongNetwork: false,
  loading: true,

  initializeProvider: async () => {
    try {
      const provider = await getEthereumProvider();
      if (!provider) return;

      const signer = await initializeSigner(provider);
      const accounts = await provider.listAccounts();
      const network = await provider.getNetwork();
      const chainId = network.chainId;
      const isWrongNetwork = chainId !== currentNetwork.chainId;

      set({
        provider,
        signer,
        address: accounts[0],
        chainId,
        isWrongNetwork,
        loading: false,
      });

      // Initialize contract after wallet is ready
      if (signer && !isWrongNetwork) {
        const contractStore = useContractStore.getState();
        await contractStore.initializeContract(signer);
      }

      // Set up wallet event listeners
      const cleanup = setupEventListeners(
        (address: string, chainId: number, isWrongNetwork: boolean) => {
          set({ address, chainId, isWrongNetwork });

          // Reinitialize contract if network is correct
          if (!isWrongNetwork && signer) {
            const contractStore = useContractStore.getState();
            contractStore.initializeContract(signer);
          }
        }
      );

      return cleanup;
    } catch (error) {
      handleError(error, "Failed to initialize provider");
      set({ loading: false });
    }
  },

  connectWallet: async () => {
    try {
      set({ loading: true });
      await walletService.connectWallet(set, get);
      set({ walletConnected: true });
    } catch (error) {
      handleError(error, "Failed to connect wallet");
    } finally {
      set({ loading: false });
    }
  },

  disconnectWallet: () => walletService.disconnectWallet(set, get),
  switchNetwork: () => walletService.switchNetwork(set, get),
}));

export default useWalletStore;
