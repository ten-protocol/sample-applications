<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { useBattleStore } from '../stores/battleStore'

const battleStore = useBattleStore()

const gridSize = computed(() => battleStore.gridSize)
const ships = computed(() => battleStore.ships)

const gridCells = computed(() => {
  const cells = [] as { x: number; y: number }[]
  for (let y = 0; y < gridSize.value; y++) {
    for (let x = 0; x < gridSize.value; x++) {
      cells.push({ x, y })
    }
  }
  return cells
})

const hitMap = ref<boolean[][]>(
  Array.from({ length: gridSize.value }, () => Array(gridSize.value).fill(false))
)
const sunkShipMap = ref<boolean[][]>(
  Array.from({ length: gridSize.value }, () => Array(gridSize.value).fill(false))
)

const getCellClass = (cell: { x: number; y: number }) => {
  let className = ''
  if (hitMap.value[cell.y][cell.x]) {
    className += 'hit '
  }
  if (sunkShipMap.value[cell.y][cell.x]) {
    className += 'sunk '
  }
  return className.trim()
}

function getShipCells(ship: { hits: boolean[]; start: [number, number] }) {
  const [startX, startY] = ship.start
  return ship.hits.map((_, i) => ({ x: startX + i, y: startY }))
}

async function handleShootCpuShip(x: number, y: number) {
  if (hitMap.value[y][x]) return

  try {
    hitMap.value[y][x] = true
    await battleStore.shootCpuShip(x, y)
  } catch (error) {
    console.error('Error:', error.message)
    hitMap.value[y][x] = false
  }
}

watchEffect(() => {
  ships.value = battleStore.ships
})

watch(
  () => battleStore.hitsMap,
  (newHits) => {
    newHits.forEach((hit) => {
      hitMap.value[hit[1]][hit[0]] = true
    })
  },
  { immediate: true, deep: true }
)

watch(
  () => battleStore.graveyard,
  (newGraveyard) => {
    newGraveyard.forEach((isSunk: boolean, index: number) => {
      if (isSunk) {
        const ship = ships.value[index]
        getShipCells(ship).forEach((cell) => {
          sunkShipMap.value[cell.y][cell.x] = true
        })
      }
    })
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <div class="grid">
    <div
      v-for="cell in gridCells"
      :key="`${cell.x}-${cell.y}`"
      class="cell tooltip"
      :class="getCellClass(cell)"
      @click="handleShootCpuShip(cell.x, cell.y)"
    >
      <!-- <span class="sunk-emoji" v-if="sunkShipMap[cell.y][cell.x]">💥</span> -->
      <span class="tooltiptext">
        x: {{ cell.x }}, y: {{ cell.y }}
        <span v-if="sunkShipMap[cell.y][cell.x]"> <br />Sunk ship </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10px, 1fr));
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
  cursor: pointer;
}
.cell:hover {
  background-color: lightcoral;
}
.cell.hit {
  background-color: darkblue;
  cursor: not-allowed;
}
.cell.sunk {
  background-color: darkred;
}

.sunk-emoji {
  font-size: 10px;
}

.tooltip {
  position: relative;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  bottom: 155%;
  left: 50%;
  margin-left: -60px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
