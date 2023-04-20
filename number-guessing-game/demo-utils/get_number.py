import argparse, ast
from web3 import Web3

# the end usr and contract address for getting the slot
endUsr='c0cfd792ad77e40528b58c19a8f5fb3246daabaaaf85b08635b2b5e09ffa5a27'
contractAddress='0xC0370e0b5C1A41D447BDdA655079A1B977C71aA9'

def get_target(web3, ):
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
    parser.add_argument('--network', help='Set network to hardhat or obscuro (defaults hardhat)')
    args = parser.parse_args()

    web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545/'))
    if args.network == 'obscuro': web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:3000/'))
    try:
        get_target(web3)
    except ValueError as error:
        print('Error calling eth end point: %s' % ast.literal_eval(str(error))['message'])
