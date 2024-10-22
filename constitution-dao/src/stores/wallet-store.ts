import { create } from "zustand";
import { walletService } from "../services/walletService";
import { IWalletState } from "../lib/interfaces/wallet";
import { WalletStoreGet, WalletStoreSet } from "../lib/types/common";

const useWalletStore = create<IWalletState>(
  (set: WalletStoreSet, get: WalletStoreGet) => ({
    provider: null,
    signer: null,
    address: "",
    chainId: null,
    walletConnected: false,
    isWrongNetwork: false,
    loading: true,

    initializeProvider: () => walletService.initializeProvider(set, get),
    connectWallet: () => walletService.connectWallet(set, get),
    disconnectWallet: () => walletService.disconnectWallet(set, get),
    switchNetwork: () => walletService.switchNetwork(set, get),
  })
);

export default useWalletStore;
