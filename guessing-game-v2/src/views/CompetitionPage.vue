<template>
  <main class="center-content">
    <meta-mask-connect-button class="metamask-button">Connect To Metamask</meta-mask-connect-button>
    <GuessingInput />
    <MessageLog />
  </main>
</template>
  
<script setup>
import GuessingInput from '@/components/GuessingInput.vue'
import MetaMaskConnectButton from '@/components/MetaMaskConnectButton.vue'
import MessageLog from '@/components/MessageLog.vue'
</script>
  
<style>
</style>