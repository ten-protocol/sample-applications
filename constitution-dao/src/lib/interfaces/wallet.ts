import { ethers } from "ethers";

export interface IWalletState {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  address: string;
  chainId: number | null;
  walletConnected: boolean;
  isWrongNetwork: boolean;
  loading: boolean;
  initializeProvider: () => void;
  connectWallet: () => void;
  disconnectWallet: () => void;
  switchNetwork: () => void;
}

export interface ContractState {
  contract: ethers.Contract | null;
  contribution: string;
  totalRaised: string;
  deadline: number;
  isThresholdMet: boolean;
  isAuctionWon: boolean;
  loading: boolean;
  progressEstimate: number;
}

export interface ContractActions {
  initializeContract: (signer: ethers.Signer) => Promise<void>;
  handleContribute: () => Promise<void>;
  setContribution: (contribution: string) => void;
  handleRefund: () => Promise<void>;
  cleanup: () => void;
}
