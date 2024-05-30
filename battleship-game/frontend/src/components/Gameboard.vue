<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { useBattleStore } from '../stores/battleStore'

defineProps<{
  user: 'player' | 'cpu'
}>()

const battleStore = useBattleStore()
const gridWidth = ref(`w-[800px]`)
const cellWidth = ref(`w-[8px]`)
const cpuCells = ref<HTMLDivElement | null>(null)

const ships = ref(battleStore.ships)

async function handleShootCpuShip(cellName: string) {
  if (cpuCells.value) {
    await battleStore.shootCpuShip(cellName)
  }
}

function getShipCells(ship) {
  const [x, y] = ship.position
  // Assuming ship orientation is horizontal; adjust logic for vertical ships if needed
  return [
    { x, y },
    { x: x + 1, y },
    { x: x + 2, y }
  ]
}

// 0: [19, 0, x: 19, y: 0]
// 1: [false, false, false]
// hits: [false, false, false]
// start: [19, 0, x: 19, y: 0]

watchEffect(() => {
  ships.value = battleStore.ships
})
</script>

<template>
  <div class="border border-blue-300 w-fit h-fit mx-auto">
    <div v-for="(ship, shipIndex) in ships" :key="shipIndex" class="ship">
      <div
        v-for="(cell, cellIndex) in getShipCells(ship)"
        :key="cellIndex"
        class="aspect-square flex items-center justify-center relative border border-white w-8 h-8 bg-blue-300"
        :class="{
          hit: battleStore.isCellHit(cell.x, cell.y),
          sunk: battleStore.isShipSunk(shipIndex)
        }"
        @click="handleShootCpuShip(`${cell.x},${cell.y}`)"
      ></div>
    </div>
  </div>
</template>
