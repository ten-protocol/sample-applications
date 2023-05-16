import argparse, ast, sys, os
from web3 import Web3
from dotenv import load_dotenv
load_dotenv()


def get_target():
    # get the storage of the first slot
    slot0=web3.eth.getStorageAt(contractAddress, 0)
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
    args = parser.parse_args()

    web3 = None
    if args.network == 'obscuro':
        web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:4000/'))
        contractAddress = '0x2f1C77134D5E6dc76e90708A5D0d8B6918b1b7d3'
    elif args.network == 'arbitrum':
        web3 = Web3(Web3.HTTPProvider('https://arb-goerli.g.alchemy.com/v2/%s'%os.getenv("ARB_API_KEY")))
        contractAddress = '0xC0370e0b5C1A41D447BDdA655079A1B977C71aA9'
    else:
        print('--network should be either obscuro or arbitrum')
        sys.exit(-1)

    try:
        get_target()
    except ValueError as error:
        print('Error calling eth end point: %s' % ast.literal_eval(str(error))['message'])
