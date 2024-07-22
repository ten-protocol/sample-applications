/** @type import('hardhat/config').HardhatUserConfig */

require('dotenv').config()
require('@nomicfoundation/hardhat-toolbox')

const { PRIVATE_KEY, USER_KEY } = process.env

task('deploy', 'Deploys the BattleshipGame contract').setAction(async (taskArgs, hre) => {
  const BattleshipGame = await hre.ethers.getContractFactory('BattleshipGame')
  const battleshipGame = await BattleshipGame.deploy()
  await battleshipGame.deployed()

  console.log('BattleshipGame deployed to:', battleshipGame.address)
})

module.exports = {
  solidity: '0.8.19',
  paths: {
    sources: './contracts',
    artifacts: './src/assets/contract/artifacts'
  },
  networks: {
    ten: {
      chainId: 443,
      url: `https://testnet.obscu.ro/v1/${USER_KEY}`,
      gasPrice: 2000000000,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
}
