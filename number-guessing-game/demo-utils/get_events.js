const Web3 = require('web3')
const fs = require('fs')
const ethers = require('ethers')
const commander = require('commander')

require('console-stamp')(console, 'HH:MM:ss')

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
    .parse(process.argv)

const options = commander.opts()

var network_ws = 'ws://127.0.0.1:8545'
var network_http = 'http://127.0.0.1:8545'
var pk_end_usr = '0x8ead642ca80dadb0f346a66cd6aa13e08a8ac7b5c6f7578d4bac96f5db01ac99'
var pk_cheat = '0xc0cfd792ad77e40528b58c19a8f5fb3246daabaaaf85b08635b2b5e09ffa5a27'
var address = '0xC0370e0b5C1A41D447BDdA655079A1B977C71aA9'
var json = fs.readFileSync('game.abi')
var abi = JSON.parse(json)

if (options.network == 'obscuro') {
  network_http = 'http://127.0.0.1:4000'
  network_ws = 'ws://127.0.0.1:4001'
} else if (options.network == 'arbitrum') {
  network_http = 'https://arb-goerli.g.alchemy.com/v2/jHwvOwJIBbcpcv95SGolTONziapOitU6'
  network_ws = 'wss://arb-goerli.g.alchemy.com/v2/jHwvOwJIBbcpcv95SGolTONziapOitU6'
  address = '0x73EA03b0B2e1bD4aF6Df17f59ffeE925166C036d'
}

const provider = new ethers.providers.WebSocketProvider(network_ws)
var pk = pk_cheat
const contract = new ethers.Contract(address, abi, provider)
const iface = new ethers.utils.Interface(abi)

if (options.network == 'obscuro') {
  let sign = (message) => { return web3.eth.accounts.sign(message, pk) }
  let web3 = new Web3()
  generate_viewing_key(sign, network_http, web3.eth.accounts.privateKeyToAccount(pk).address, task)
}
else{
  task()
}


