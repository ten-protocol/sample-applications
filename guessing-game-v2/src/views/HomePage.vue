<template>
  <main class="center-content">
    <router-link to="/competition" target="_blank">
      <el-button class="btn btn-primary">
        Join Guessing Game Competition
        <el-icon><Promotion /></el-icon>
      </el-button>
    </router-link>
    <meta-mask-connect-button class="metamask-button" :scope="'home'"
      >Connect To Metamask</meta-mask-connect-button
    >
    <GuessingInput :scope="'home'" />
    <MessageLog :scope="'home'" />
  </main>
</template>

<script setup>
import GuessingInput from '@/components/GuessingInput.vue'
import MetaMaskConnectButton from '@/components/MetaMaskConnectButton.vue'
import MessageLog from '@/components/MessageLog.vue'
</script>

<style>
</style>