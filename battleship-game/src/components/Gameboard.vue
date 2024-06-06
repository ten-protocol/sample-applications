<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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

const getCellClass = computed(() => {
  return (cell: { x: number; y: number }) => {
    if (hitMap.value[cell.y][cell.x]) {
      return 'hit'
    }
  }
})

const hitMap = ref<boolean[][]>(Array.from({ length: gridSize }, () => Array(gridSize).fill(false)))

watch(
  () => battleStore.hitsMap,
  (newHits) => {
    newHits.forEach((hit) => {
      hitMap.value[hit[1]][hit[0]] = true
    })
  },
  { immediate: true, deep: true }
)

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
      :class="getCellClass(cell)"
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
