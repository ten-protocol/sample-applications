<template>
  <div class="wrapper py-8">
    <div class="w-fit mx-auto">
      <div
        class="w-fit px-4 py-2 thick-shadow bg-white border-2 border-black text-sm border-r-8 border-b-8"
      >
        History
      </div>
      <table>
        <thead class="bg-neutral-400">
          <tr>
            <th>Move TxId</th>
            <th>Time</th>
            <th>X Coordinate</th>
            <th>Y Coordinate</th>
            <th>Win</th>
            <th>Reward (ETH)</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="HISTORY.length">
            <tr v-for="(move, index) in HISTORY" :key="index">
              <td>{{ move.transactionHash }}</td>
              <td>{{ move.timestamp }}</td>
              <td>{{ move.x }}</td>
              <td>{{ move.y }}</td>
              <td>{{ move.win }}</td>
              <td>{{ move.reward }}</td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="6"><p class="text-center">You have not made any moves yet</p></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()

const HISTORY = ref(gameStore.history)

watchEffect(() => {
  HISTORY.value = gameStore.history
})
</script>

<style scoped>
table {
  width: 800px;
  margin-top: 2rem;
  border-collapse: collapse;
  border: 1px solid black;
}

th,
td {
  padding: 0.5rem;
  font-size: 14px;
  text-align: left;
  border-right: 1px solid black;
}

tbody > tr:nth-child(odd) {
  background: #d4d4d4;
}
</style>
