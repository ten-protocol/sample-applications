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
  gameActive.value = gameStore.isGameActive
})
</script>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
