/** @type import('hardhat/config').HardhatUserConfig */

require('dotenv').config()
require('@nomicfoundation/hardhat-toolbox')
require('@nomiclabs/hardhat-ethers')

const { PRIVATE_KEY, USER_KEY } = process.env

task('deploy', 'Deploys the GuessingGame contract').setAction(async (taskArgs, hre) => {
  const GuessingGame = await hre.ethers.getContractFactory('GuessingGame')
  const guessingGame = await GuessingGame.deploy()
  await guessingGame.deployed()

  console.log('GuessingGame deployed to:', guessingGame.address)
})

task('deploy', 'Deploys the GuessingGameCompetition contract').setAction(async (taskArgs, hre) => {
  const GuessingGameCompetition = await hre.ethers.getContractFactory('GuessingGameCompetition')
  const guessingGameCompetition = await GuessingGameCompetition.deploy()
  await guessingGameCompetition.deployed()

  console.log('GuessingGameCompetition deployed to:', guessingGameCompetition.competition_address)
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
