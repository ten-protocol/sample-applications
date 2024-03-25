<template>
  <main class="center-content">
    <router-link to="/" class="">
      <el-button class="btn btn-primary">
        <el-icon><Back /></el-icon>
        <span> </span>
        Back To Guessing Game
      </el-button>
    </router-link>
    <meta-mask-connect-button class="metamask-button" :scope="'competition'"
      >Connect To Metamask</meta-mask-connect-button
    >
    <GuessingInput :scope="'competition'" />
    <MessageLog :scope="'competition'" />
  </main>
</template>
  
<script setup>
import GuessingInput from '@/components/GuessingInput.vue'
import MetaMaskConnectButton from '@/components/MetaMaskConnectButton.vue'
import MessageLog from '@/components/MessageLog.vue'
</script>
  
<style>
</style>