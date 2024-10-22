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

export interface IContractState {
  contract: ethers.Contract | null;
  contribution: string;
  totalRaised: string;
  loading: boolean;
  deadline: number;
  isThresholdMet: boolean;
  isAuctionWon: boolean;
  progressEstimate: number;
  handleContribute: () => void;
  setContribution: (contribution: string) => void;
  handleRefund: () => void;
}
