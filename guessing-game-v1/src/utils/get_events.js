require('dotenv').config({ path: `../.env` })
const fs = require('fs')
const Web3 = require('web3')
const ethers = require('ethers')
const commander = require('commander')

require('console-stamp')(console, 'HH:MM:ss')

const { CHEAT_PK, ARB_API_KEY } = process.env;

function generate_viewing_key(sign, network_url, address, callback) {
  fetch(network_url +'/generateviewingkey/', {
    method: 'POST',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify({address: address})
  })
      .then(response => response.text())
      .then((response) => {
        sign_viewing_key(sign, network_url, address, callback, response)
      })
}

function sign_viewing_key(sign, network_url, address, callback, response) {
  signed_msg = sign('vk' + response)

  fetch(network_url + '/submitviewingkey/', {
    method: 'POST',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify( {signature: signed_msg.signature, address: address})
  })
      .then(response => response.text())
      .then((response) => {
        callback()
      })
}

async function task() {
  const events = await contract.queryFilter('GuessResult', 0, 'latest')
  if (events.length) {
    for (var i = 0, len = events.length; i < len; i+=1) {
      log = iface.decodeEventLog('GuessResult', events[i].data, events[i].topics)
      console.log(log.player, 'Guess of', log.guess.toNumber(), 'was', log.msg, ethers.utils.formatEther(log.prize), 'OGG.')
    }
  }
  else {
    console.log('No events in return set')
  }
}

commander
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option('--network <value>', 'Set network to hardhat or obscuro (defaults hardhat)')
    .option('--address <value>', 'The contract address of the guessing game')
    .option('--token <value>', 'The ten gateway token')
    .option('--api_key <value>', 'The sepolia API key')
    .parse(process.argv)

const options = commander.opts()
var json = fs.readFileSync('../../artifacts/contracts/Guess.sol/Guess.json')
var abi = JSON.parse(json)['abi']

contractAddress = options.address
if (options.network === 'ten') {
  network_http = 'https://testnet.ten.xyz/v1/'+options.token
  network_ws = 'wss://testnet.ten.xyz:81/v1/'+options.token
}
else if (options.network === 'sepolia') {
  network_http = 'https://eth-sepolia.g.alchemy.com/v2'+options.api_key
  network_ws = 'wss://eth-sepolia.g.alchemy.com/v2/'+options.api_key
}
else if (options.network === 'hardhat') {
  network_http = 'http://127.0.0.1:8545/'
  network_ws = 'ws://127.0.0.1:8545'
}

const provider = new ethers.providers.WebSocketProvider(network_ws)
const contract = new ethers.Contract(contractAddress, abi, provider)
const iface = new ethers.utils.Interface(abi)

if (options.network === 'obscuro') {
  let sign = (message) => { return web3.eth.accounts.sign(message, CHEAT_PK) }
  let web3 = new Web3()
  generate_viewing_key(sign, network_http, web3.eth.accounts.privateKeyToAccount(CHEAT_PK).address, task)
}
else{
  task()
}


