<template>
  <el-button @click="connectMetamask" size="large">
    <img src="@/assets/icons/icon_metamask.png" alt="Connect with wallet" class="metamask-icon" />
    {{ buttonText }}
  </el-button>
</template>

<script>
import detectEthereumProvider from '@metamask/detect-provider'
import { useWalletStore } from '@/stores/walletStore'
import { useMessageStore } from '@/stores/messageStore'
import { ref } from 'vue'
import Web3listener from '@/lib/web3listener'
import { trackEvent } from '../lib/utils'
import Web3Service from '@/lib/web3service'

export default {
  name: 'MetaMaskConnectButton',
  props: {
    scope: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const walletStore = useWalletStore()
    const messageStore = useMessageStore()
    const buttonText = ref('Connect with MetaMask')

    async function connectMetamask() {
      try {
        const provider = await detectEthereumProvider()

        if (provider) {
          const chainId = await provider.request({ method: 'eth_chainId' })
          if (chainId !== '0x1bb') {
            messageStore.addMessage(
              'Not connected to Ten ! Connect at <a href="https://testnet.ten.xyz/" target="_blank" rel="noopener noreferrer">https://testnet.ten.xyz/</a> ',
              props.scope
            )
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

          messageStore.addMessage('Connected to wallet ! Account: ' + accounts[0], props.scope)
          buttonText.value = 'Connected!'

          new Web3listener(walletStore.signer, props.scope)
          new Web3Service(walletStore.signer)
        } else {
          messageStore.addMessage('Please install MetaMask!', props.scope)
        }
      } catch (err) {
        console.error('Error:', err.message)
      }
    }

    return {
      connectMetamask,
      buttonText
    }
  },
  async mounted() {
    await this.connectMetamask()
  }
}
</script>

<style scoped>
.metamask-icon {
  width: 24px;
  height: 24px;
  object-fit: cover;
  margin-right: 8px;
}
</style>