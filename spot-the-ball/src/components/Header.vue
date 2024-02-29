<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="0">
      <span> Welcome to Spot the Ball </span>
    </el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="1">Processing Center</el-menu-item>
    <el-sub-menu index="2">
      <template #title>Workspace</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { formatEther } from 'ethers/lib/utils'
import MetaMaskConnectButton from './MetaMaskConnectButton.vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()
const prizePool = ref('')
const timeLeft = ref()
const gameActive = ref(false)
const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const showPreviousMoves = (event: Event) => {
  gameStore.showPreviousMoves = (event.target as HTMLInputElement).checked
}

watchEffect(() => {
  prizePool.value = formatEther(gameStore.game?.[3] || 0)
  timeLeft.value = gameStore.timeLeft
  gameActive.value = gameStore.isGameActive
})
</script>

<!-- <template>
  <div class="wrapper">
    <div class="py-8 flex items-start justify-between">
      <div class="flex justify-between gap-4">
        <div
          class="w-fit px-4 py-2 thick-shadow bg-white border-2 border-black text-sm border-r-8 border-b-8"
        >
          Welcome to Spot the Ball
        </div>
        <MetaMaskConnectButton />
      </div>
      <div class="flex flex-col gap-4">
        <div
          class="w-fit grid grid-cols-2 gap-4 border-2 border-black p-4 text-sm border-r-8 border-b-8"
        >
          <p>Total Pool:</p>
          <p>{{ prizePool }} ETH</p>
          <p>Time Remaining:</p>
          <p>{{ timeLeft }}</p>
        </div>

        <div class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            @change="showPreviousMoves"
            :disabled="!gameActive"
            :class="{ 'cursor-not-allowed': !gameActive }"
          />
          <label>Previous moves</label>
        </div>
      </div>
    </div>
  </div>
</template> -->
