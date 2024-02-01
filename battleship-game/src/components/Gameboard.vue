<script setup lang="ts">
import { CELLS, BATTLESHIPS } from '../lib/constants'
import { onMounted, ref } from 'vue'
import { useBattleStore } from '../store/battleStore'

defineProps<{
  user: 'player' | 'cpu'
}>()

const battleStore = useBattleStore()
const gridCells = ref<string[]>([])
const cpuCells = ref<HTMLElement | null>(null)
const gridWidth = ref(`w-[800px]`)
const cellWidth = ref(`w-[8px]`)

async function handleShootCpuShip(i: string) {
  if (cpuCells.value) {
    const cells = Array.from(cpuCells.value.children) as HTMLElement[]
    await battleStore.shootCpuShip(i, cells, BATTLESHIPS)
    await battleStore.getMessages()
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
    const cells = Array.from(cpuCells.value.children) as HTMLElement[]
    BATTLESHIPS.forEach((ship) => battleStore.addCpuShip(ship, cells))

    battleStore.getHitCells()
    battleStore.getHitShips()
    battleStore.getSunkShips()
  }
})
</script>

<template>
  <div class="border border-blue-300 w-fit h-fit mx-auto">
    <div
      :class="`${gridWidth} flex flex-wrap bg-aqua `"
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
