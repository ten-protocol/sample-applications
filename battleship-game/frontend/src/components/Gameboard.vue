<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { CELLS } from '../lib/constants'
import { useBattleStore } from '../stores/battleStore'

defineProps<{
  user: 'player' | 'cpu'
}>()

const battleStore = useBattleStore()
const gridCells = ref<string[]>([])
const cpuCells = ref<HTMLElement | null>(null)
const gridWidth = ref(`w-[800px]`)
const cellWidth = ref(`w-[8px]`)
const BATTLESHIPS = battleStore.ships

async function handleShootCpuShip(i: string) {
  if (cpuCells.value) {
    const cells = Array.from(cpuCells.value.children) as HTMLElement[]
    await battleStore.shootCpuShip(i, cells, BATTLESHIPS)
    await battleStore.getSunkShips()
  }
}

async function renderGridCells() {
  return new Promise<void>((resolve) => {
    gridCells.value = CELLS

    resolve()
  })
}

onMounted(async () => {
  await renderGridCells()

  if (cpuCells.value) {
    battleStore.getHitCells()
    battleStore.getHitShips()
    battleStore.getSunkShips()
  }
})
</script>

<template>
  <div class="border border-blue-300 w-fit h-fit mx-auto">
    <div
      :class="`${gridWidth} flex flex-wrap bg-aqua`"
      :ref="user === 'player' ? 'playerCells' : 'cpuCells'"
    >
      <div
        v-for="(cellName, i) in gridCells"
        :key="cellName"
        :id="String(i + 1)"
        :class="`${cellName} ${cellWidth} aspect-square flex items-center justify-center relative border border-white`"
        @click="handleShootCpuShip(String(i + 1))"
      ></div>
    </div>
  </div>
</template>
