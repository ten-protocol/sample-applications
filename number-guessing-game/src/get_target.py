from web3 import Web3

appDevPK='f52e5418e349dccdda29b6ac8b0abe6576bb7713886aa85abea6181ba731f9bb'
contractAddress='0xC0370e0b5C1A41D447BDdA655079A1B977C71aA9'

web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545/'))
account = web3.eth.account.privateKeyToAccount(appDevPK)
print('Owner address: %s' % account.address)

# get the storage of the first slot
slot0=web3.eth.getStorageAt(contractAddress, 0)
print('Slot bytes:    %s' % slot0.hex())

# slot 0 last 20 bytes owner address [12:32]
address=slot0[12:32]
print('Owner:         %s' % address.hex())

# slot 0 11th byte is the target
target=slot0[11]
print('Target:        %d' % target)



