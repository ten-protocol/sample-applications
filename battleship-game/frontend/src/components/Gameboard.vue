<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useBattleStore } from '../stores/battleStore'

const battleStore = useBattleStore()

const ships = ref(battleStore.ships) // Might be needed for other functionalities
const gridSize = 100

// Pre-compute grid cells (assuming grid size doesn't change)
const gridCells = [] as { x: number; y: number }[]
for (let y = 0; y < gridSize; y++) {
  for (let x = 0; x < gridSize; x++) {
    gridCells.push({ x, y })
  }
}

const hitMap: boolean[][] = Array(gridSize)
  .fill(false)
  .map(() => new Array(gridSize).fill(false))

watchEffect(() => {
  const newHits = battleStore.hits

  newHits.forEach((hit) => {
    hitMap[hit.y][hit.x] = true
  })
})

function handleShootCpuShip(x: number, y: number) {
  battleStore.shootCpuShip(x, y)
}
</script>

<template>
  <div class="grid">
    <div
      v-for="cell in gridCells"
      :key="`${cell.x}-${cell.y}`"
      class="cell"
      :class="{
        hit: hitMap[cell.y][cell.x]
        // sunk: /* Logic to determine sunk based on ships and hitMap */
      }"
      @click="handleShootCpuShip(cell.x, cell.y)"
    ></div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(100, 1fr);
  gap: 1px;
}
.cell {
  width: 10px;
  height: 10px;
  background-color: lightblue;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
}
.cell.hit {
  background-color: red;
}
.cell.sunk {
  background-color: darkred;
}
</style>
