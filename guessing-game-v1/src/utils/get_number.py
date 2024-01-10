import argparse, ast, sys
from web3 import Web3


def get_target():
    # get the storage of the first slot
    slot0=web3.eth.get_storage_at(contractAddress, 0)
    print('Slot bytes:    %s' % slot0.hex())

    # slot 0 last 20 bytes owner address [12:32]
    address=slot0[12:32]
    print('Owner:         %s' % address.hex())

    # slot 0 11th byte is the target
    target=slot0[11]
    print('Target:        %d' % target)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Try to cheat and get the target from storage')
    parser.add_argument('--network', help='Set network to hardhat or obscuro (defaults hardhat)', required=True)
    parser.add_argument('--address', help='The contract address of the guessing game')
    parser.add_argument('--token', help='The ten gateway token')
    parser.add_argument('--api_key', help='The sepolia API key')
    args = parser.parse_args()

    web3 = None
    contractAddress = args.address
    if args.network == 'ten':
        web3 = Web3(Web3.HTTPProvider('https://testnet.ten.xyz/v1/%s' % args.token))
    elif args.network == 'sepolia':
        web3 = Web3(Web3.HTTPProvider('https://eth-sepolia.g.alchemy.com/v2/%s' % args.api_key))
    elif args.network == 'hardhat':
        web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545/'))
    else:
        print('--network should be either ten, sepolia or hardhat')
        sys.exit(-1)

    try:
        get_target()
    except ValueError as error:
        print('Error calling eth end point: %s' % ast.literal_eval(str(error))['message'])
