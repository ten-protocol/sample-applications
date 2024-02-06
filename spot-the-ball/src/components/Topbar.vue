<template>
  <div class="w-full h-[48px] bg-slate-800 flex items-center justify-between p-4">
    <div class="text-white font-bold">SPOT THE BALL - ADMIN</div>

    <div class="flex items-center gap-4">
      <MetaMaskConnectButton />
    </div>
  </div>
</template>

<script>
import MetaMaskConnectButton from './MetaMaskConnectButton.vue'

export default {
  name: 'Topbar',
  components: {
    MetaMaskConnectButton
  }
}
</script>