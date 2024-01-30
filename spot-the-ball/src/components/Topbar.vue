<script setup lang="ts">
import { RouterLink } from 'vue-router'
import MetaMaskConnectButton from './MetaMaskConnectButton.vue'
</script>

<template>
  <div class="w-full h-[48px] bg-slate-800 flex items-center justify-between p-4">
    <div class="text-white font-bold">Game Title</div>

    <div class="flex items-center gap-4">
      <button class="bg-slate-700 text-white rounded-lg py-1 px-4 text-[14px]">
        Connect Wallet
      </button>
      <!-- <MetaMaskConnectButton /> -->

      <RouterLink to="/auth" class="text-white rounded-lg py-1 px-4 text-[14px]">Admin</RouterLink>
    </div>
  </div>
</template>
