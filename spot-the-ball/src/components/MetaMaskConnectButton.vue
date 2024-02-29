<template>
  <button
    class="bg-slate-700 text-white rounded-lg py-1 px-4 text-[14px] flex items-center gap-2"
    @click="connectMetamask"
  >
    <img class="metamask-icon" src="@/assets/icons/icon_metamask.png" alt="MetaMask Fox" />
    {{ buttonText }}
  </button>
</template>

<script>
import detectEthereumProvider from '@metamask/detect-provider'
import { useWalletStore } from '@/stores/walletStore'
import { useMessageStore } from '@/stores/messageStore'
import { ref } from 'vue'
import Web3listener from '@/lib/web3listener'
import Web3Service from '@/lib/web3service'
import { trackEvent } from '../lib/utils'
import Common from '../lib/common'
import { useGameStore } from '../stores/gameStore'

export default {
  name: 'MetaMaskConnectButton',
  setup() {
    const walletStore = useWalletStore()
    const messageStore = useMessageStore()
    const gameStore = useGameStore()
    const buttonText = ref('Connect with MetaMask')

    async function connectMetamask() {
      const provider = await detectEthereumProvider()

      if (provider) {
        const chainId = await provider.request({ method: 'eth_chainId' })
        if (chainId !== '0x1bb') {
          messageStore.addMessage(
            'Not connected to Ten ! Connect at <a href="https://testnet.ten.xyz/" target="_blank" rel="noopener noreferrer">https://testnet.ten.xyz/</a> '
          )
          buttonText.value = 'Wrong Network, Switch to Ten'
          return
        }

        // Request account access if needed
        const accounts = await provider.request({ method: 'eth_requestAccounts' })

        // Set provider and address in the store
        walletStore.setProvider(provider)
        walletStore.setAddress(accounts[0])

        trackEvent('connect_wallet', {
          value: accounts[0]
        })

        messageStore.addMessage('Connected to wallet ! Account: ' + accounts[0])
        buttonText.value = 'Connected!'

        new Web3Service(walletStore.signer, Common.CONTRACT_ADDRESS)
        new Web3listener(walletStore.signer, Common.CONTRACT_ADDRESS)

        await gameStore.getHistory()
        await gameStore.getGame()
      } else {
        messageStore.addMessage('Please install MetaMask!')
      }
    }

    return {
      connectMetamask,
      buttonText
    }
  },
  async mounted() {
    const provider = await detectEthereumProvider()
    const messageStore = useMessageStore()
    const walletStore = useWalletStore()
    const gameStore = useGameStore()

    const chainId = await provider.request({ method: 'eth_chainId' })
    if (chainId !== '0x1bb') {
      messageStore.addMessage(
        'Not connected to Ten ! Connect at <a href="https://testnet.ten.xyz/" target="_blank" rel="noopener noreferrer">https://testnet.ten.xyz/</a> '
      )
      buttonText.value = 'Wrong Network, Switch to Ten'
      return
    }

    await provider
      .request({ method: 'eth_accounts' })
      .then((accounts) => {
        if (accounts.length !== 0) {
          walletStore.setProvider(provider)
          walletStore.setAddress(accounts[0])
          messageStore.addMessage('Connected to wallet ! Account: ' + accounts[0])
          this.buttonText = 'Connected!'
          new Web3Service(walletStore.signer, Common.CONTRACT_ADDRESS)
          new Web3listener(walletStore.signer, Common.CONTRACT_ADDRESS)
        } else {
          messageStore.addMessage('No wallet connected...')
        }
      })
      .catch((error) => {
        console.error('Error checking MetaMask connection:', error)
      })

    await gameStore.getHistory()
    await gameStore.getGame()
  }
}
</script>

<style scoped>
.metamask-icon {
  width: 24px; /* Set desired width */
  height: 24px; /* Set desired height */
  object-fit: cover; /* Ensure image content is not distorted */
}
</style>
