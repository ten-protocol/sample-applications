import {
  ContractActions,
  ContractState,
  IWalletState,
} from "../interfaces/wallet";

export interface IContractState extends ContractState, ContractActions {}

export type WalletStoreSet = (
  partial:
    | IWalletState
    | Partial<IWalletState>
    | ((state: IWalletState) => IWalletState | Partial<IWalletState>),
  replace?: boolean | undefined
) => void;

export type WalletStoreGet = () => IWalletState;

export interface WalletStoreInterface {
  state: IWalletState;
  set: WalletStoreSet;
  get: WalletStoreGet;
}

export type ContractStoreSet = (
  partial:
    | IContractState
    | Partial<IContractState>
    | ((state: IContractState) => IContractState | Partial<IContractState>),
  replace?: boolean | undefined
) => void;

export type ContractStoreGet = () => IContractState;

export interface ContractStoreInterface {
  state: IContractState;
  set: ContractStoreSet;
  get: ContractStoreGet;
}

export interface ResponseDataInterface<T> {
  result: T;
  errors?: string[] | string;
  item: T;

  message: string;
  pagination?: PaginationInterface;
  success: string;
}

export interface PaginationInterface {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface DocumentContentInterface {
  heading: string;
  content: string[];
}

export interface DocumentInterface {
  title: string;
  subHeading: string;
  content: DocumentContentInterface[];
}
