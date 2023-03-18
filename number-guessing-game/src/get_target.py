import argparse
from web3 import Web3

# the end usr and contract address for getting the slot
endUsr='8ead642ca80dadb0f346a66cd6aa13e08a8ac7b5c6f7578d4bac96f5db01ac99'
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
    parser.add_argument('--network', help='Either hardhat or obscuro')
    args = parser.parse_args()

    if args.network == 'hardhat':
        web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545/'))
        get_target(web3)
    elif args.network == 'obscuro':
        web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:3000/'))
        get_target(web3)