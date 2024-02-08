<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { formatEther } from 'ethers/lib/utils'
import MetaMaskConnectButton from './MetaMaskConnectButton.vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()
const prizePool = ref('')

const showPreviousMoves = (event: Event) => {
  gameStore.showPreviousMoves = (event.target as HTMLInputElement).checked
}

watchEffect(() => {
  prizePool.value = formatEther(gameStore.game?.[3] || 0)
})
</script>

<template>
  <div class="wrapper">
    <div class="py-8 flex items-start justify-between">
      <div class="flex justify-between gap-4">
        <div class="w-fit px-4 py-2 thick-shadow bg-white border-2 border-black text-sm">
          Welcome to Spot the Ball
        </div>
        <MetaMaskConnectButton />
      </div>
      <div class="flex flex-col gap-4">
        <div class="w-fit grid grid-cols-2 gap-4 border-2 border-black p-4 text-sm">
          <p>Total Pool:</p>
          <p>{{ prizePool }} ETH</p>
        </div>

        <div class="flex items-center gap-2 text-sm">
          <input type="checkbox" @change="showPreviousMoves" />
          <label>Previous moves</label>
        </div>
      </div>
    </div>
  </div>
</template>
