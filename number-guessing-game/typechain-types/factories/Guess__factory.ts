/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { Guess, GuessInterface } from "../Guess";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint8",
        name: "range",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "guess",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "prize",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
    ],
    name: "Colder",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "guess",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "prize",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
    ],
    name: "Correct",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "guess",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "prize",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
    ],
    name: "Incorrect",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "guess",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "prize",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
    ],
    name: "Same",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "guess",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "prize",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
    ],
    name: "Warmer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "guess",
        type: "uint8",
      },
    ],
    name: "attempt",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "close",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "erc20",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "guessRange",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "prizePool",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001b5a38038062001b5a8339818101604052810190620000379190620003fe565b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600360006101000a81548160ff021916908360ff16021790555080600360016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550620000e3620000eb60201b60201c565b5050620006e0565b6000600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016200014a919062000456565b602060405180830381865afa15801562000168573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200018e9190620004ae565b14620001d1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620001c89062000567565b60405180910390fd5b60005b6001805490508161ffff1610156200029a5760006002600060018461ffff168154811062000207576200020662000589565b5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908360ff16021790555080806200029190620005f5565b915050620001d4565b5060016000620002ab919062000314565b600360009054906101000a900460ff1660ff164244604051602001620002d392919062000649565b6040516020818303038152906040528051906020012060001c620002f89190620006a8565b600060146101000a81548160ff021916908360ff160217905550565b508054600082559060005260206000209081019062000334919062000337565b50565b5b808211156200035257600081600090555060010162000338565b5090565b600080fd5b600060ff82169050919050565b62000373816200035b565b81146200037f57600080fd5b50565b600081519050620003938162000368565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620003c68262000399565b9050919050565b620003d881620003b9565b8114620003e457600080fd5b50565b600081519050620003f881620003cd565b92915050565b6000806040838503121562000418576200041762000356565b5b6000620004288582860162000382565b92505060206200043b85828601620003e7565b9150509250929050565b6200045081620003b9565b82525050565b60006020820190506200046d600083018462000445565b92915050565b6000819050919050565b620004888162000473565b81146200049457600080fd5b50565b600081519050620004a8816200047d565b92915050565b600060208284031215620004c757620004c662000356565b5b6000620004d78482850162000497565b91505092915050565b600082825260208201905092915050565b7f42616c616e6365206d757374206265207a65726f20746f207365742061206e6560008201527f77207461726765742e0000000000000000000000000000000000000000000000602082015250565b60006200054f602983620004e0565b91506200055c82620004f1565b604082019050919050565b60006020820190508181036000830152620005828162000540565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061ffff82169050919050565b60006200060282620005e7565b915061ffff8203620006195762000618620005b8565b5b600182019050919050565b6000819050919050565b620006436200063d8262000473565b62000624565b82525050565b60006200065782856200062e565b6020820191506200066982846200062e565b6020820191508190509392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6000620006b58262000473565b9150620006c28362000473565b925082620006d557620006d462000679565b5b828206905092915050565b61146a80620006f06000396000f3fe60806040526004361061004a5760003560e01c806343d726d61461004f578063719ce73e14610059578063785e9e861461008457806380d739ad146100af578063c5c88421146100da575b600080fd5b6100576100f6565b005b34801561006557600080fd5b5061006e6101bd565b60405161007b9190610ddc565b60405180910390f35b34801561009057600080fd5b50610099610260565b6040516100a69190610e76565b60405180910390f35b3480156100bb57600080fd5b506100c4610286565b6040516100d19190610ead565b60405180910390f35b6100f460048036038101906100ef9190610ef9565b610299565b005b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610184576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161017b90610fa9565b60405180910390fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b6000600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b815260040161021a9190610fea565b602060405180830381865afa158015610237573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061025b9190611031565b905090565b600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600360009054906101000a900460ff1681565b670de0b6b3a7640000600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e33306040518363ffffffff1660e01b81526004016102ff92919061105e565b602060405180830381865afa15801561031c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103409190611031565b1015610381576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610378906110d3565b60405180910390fd5b6001339080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd3330670de0b6b3a76400006040518463ffffffff1660e01b815260040161044b9392919061112e565b6020604051808303816000875af115801561046a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061048e919061119d565b50600060149054906101000a900460ff1660ff168160ff1603610656573373ffffffffffffffffffffffffffffffffffffffff167f8f2cd7b2fa156958b1c570f12d56e3850767c35917df3acce7e9e322792dbd81826104ec6101bd565b600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e33306040518363ffffffff1660e01b815260040161054992919061105e565b602060405180830381865afa158015610566573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061058a9190611031565b604051610599939291906111ca565b60405180910390a2600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb336105e86101bd565b6040518363ffffffff1660e01b8152600401610605929190611201565b6020604051808303816000875af1158015610624573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610648919061119d565b50610651610b71565b610b6e565b6000600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905060008060149054906101000a900460ff1660ff168360ff16116106e45782600060149054906101000a900460ff166106df9190611259565b610700565b600060149054906101000a900460ff16836106ff9190611259565b5b905080600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908360ff16021790555060008260ff1603610860573373ffffffffffffffffffffffffffffffffffffffff167f26b89c949c7e04d27b4b95181f69048754661891aec98f644d7b3949437e7500846107a66101bd565b600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e33306040518363ffffffff1660e01b815260040161080392919061105e565b602060405180830381865afa158015610820573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108449190611031565b604051610853939291906111ca565b60405180910390a2610b6b565b8160ff168160ff161015610969573373ffffffffffffffffffffffffffffffffffffffff167fdd79f52883e3c738b99bc119d3ca7b12bd50e3fcad8a82eed9ac377d5b103ac5846108af6101bd565b600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e33306040518363ffffffff1660e01b815260040161090c92919061105e565b602060405180830381865afa158015610929573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061094d9190611031565b60405161095c939291906111ca565b60405180910390a2610b6a565b8160ff168160ff161115610a72573373ffffffffffffffffffffffffffffffffffffffff167f4f66a2d88b49af92ccae89cc02b5766e290d206535324858169b127446ce9fcd846109b86101bd565b600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e33306040518363ffffffff1660e01b8152600401610a1592919061105e565b602060405180830381865afa158015610a32573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a569190611031565b604051610a65939291906111ca565b60405180910390a2610b69565b3373ffffffffffffffffffffffffffffffffffffffff167f7aab5742c4f1f54c4d36790a51bf1d401df37dc1bbbe719318641d1fab5ef89984610ab36101bd565b600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e33306040518363ffffffff1660e01b8152600401610b1092919061105e565b602060405180830381865afa158015610b2d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b519190611031565b604051610b60939291906111ca565b60405180910390a25b5b5b50505b50565b6000600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401610bce9190610fea565b602060405180830381865afa158015610beb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c0f9190611031565b14610c4f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c4690611300565b60405180910390fd5b60005b6001805490508161ffff161015610d115760006002600060018461ffff1681548110610c8157610c80611320565b5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908360ff1602179055508080610d099061135d565b915050610c52565b5060016000610d209190610d85565b600360009054906101000a900460ff1660ff164244604051602001610d469291906113a8565b6040516020818303038152906040528051906020012060001c610d699190611403565b600060146101000a81548160ff021916908360ff160217905550565b5080546000825590600052602060002090810190610da39190610da6565b50565b5b80821115610dbf576000816000905550600101610da7565b5090565b6000819050919050565b610dd681610dc3565b82525050565b6000602082019050610df16000830184610dcd565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6000610e3c610e37610e3284610df7565b610e17565b610df7565b9050919050565b6000610e4e82610e21565b9050919050565b6000610e6082610e43565b9050919050565b610e7081610e55565b82525050565b6000602082019050610e8b6000830184610e67565b92915050565b600060ff82169050919050565b610ea781610e91565b82525050565b6000602082019050610ec26000830184610e9e565b92915050565b600080fd5b610ed681610e91565b8114610ee157600080fd5b50565b600081359050610ef381610ecd565b92915050565b600060208284031215610f0f57610f0e610ec8565b5b6000610f1d84828501610ee4565b91505092915050565b600082825260208201905092915050565b7f4f6e6c79206f776e65722063616e2063616c6c20746869732066756e6374696f60008201527f6e2e000000000000000000000000000000000000000000000000000000000000602082015250565b6000610f93602283610f26565b9150610f9e82610f37565b604082019050919050565b60006020820190508181036000830152610fc281610f86565b9050919050565b6000610fd482610df7565b9050919050565b610fe481610fc9565b82525050565b6000602082019050610fff6000830184610fdb565b92915050565b61100e81610dc3565b811461101957600080fd5b50565b60008151905061102b81611005565b92915050565b60006020828403121561104757611046610ec8565b5b60006110558482850161101c565b91505092915050565b60006040820190506110736000830185610fdb565b6110806020830184610fdb565b9392505050565b7f436865636b2074686520746f6b656e20616c6c6f77616e63652e000000000000600082015250565b60006110bd601a83610f26565b91506110c882611087565b602082019050919050565b600060208201905081810360008301526110ec816110b0565b9050919050565b6000819050919050565b600061111861111361110e846110f3565b610e17565b610dc3565b9050919050565b611128816110fd565b82525050565b60006060820190506111436000830186610fdb565b6111506020830185610fdb565b61115d604083018461111f565b949350505050565b60008115159050919050565b61117a81611165565b811461118557600080fd5b50565b60008151905061119781611171565b92915050565b6000602082840312156111b3576111b2610ec8565b5b60006111c184828501611188565b91505092915050565b60006060820190506111df6000830186610e9e565b6111ec6020830185610dcd565b6111f96040830184610dcd565b949350505050565b60006040820190506112166000830185610fdb565b6112236020830184610dcd565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061126482610e91565b915061126f83610e91565b9250828203905060ff8111156112885761128761122a565b5b92915050565b7f42616c616e6365206d757374206265207a65726f20746f207365742061206e6560008201527f77207461726765742e0000000000000000000000000000000000000000000000602082015250565b60006112ea602983610f26565b91506112f58261128e565b604082019050919050565b60006020820190508181036000830152611319816112dd565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600061ffff82169050919050565b60006113688261134f565b915061ffff820361137c5761137b61122a565b5b600182019050919050565b6000819050919050565b6113a261139d82610dc3565b611387565b82525050565b60006113b48285611391565b6020820191506113c48284611391565b6020820191508190509392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600061140e82610dc3565b915061141983610dc3565b925082611429576114286113d4565b5b82820690509291505056fea2646970667358221220a0378b265822c6093c8a968357f9fd1d62771a6f12b05ffd3d3cc3ac884a0c0e64736f6c63430008110033";

type GuessConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GuessConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Guess__factory extends ContractFactory {
  constructor(...args: GuessConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    range: PromiseOrValue<BigNumberish>,
    tokenAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Guess> {
    return super.deploy(range, tokenAddress, overrides || {}) as Promise<Guess>;
  }
  override getDeployTransaction(
    range: PromiseOrValue<BigNumberish>,
    tokenAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(range, tokenAddress, overrides || {});
  }
  override attach(address: string): Guess {
    return super.attach(address) as Guess;
  }
  override connect(signer: Signer): Guess__factory {
    return super.connect(signer) as Guess__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GuessInterface {
    return new utils.Interface(_abi) as GuessInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Guess {
    return new Contract(address, _abi, signerOrProvider) as Guess;
  }
}
