<script setup lang="ts">
const HISTORY = [
  {
    moveTxId: '0X123',
    time: '2 min ago',
    coordinates: '300-900',
    win: 'Yes',
    reward: '2.2'
  },
  {
    moveTxId: '0X456',
    time: '6 min ago',
    coordinates: '678-433',
    win: 'No',
    reward: '0'
  }
]
</script>

<template>
  <div class="wrapper py-8">
    <div class="w-fit mx-auto">
      <div class="w-fit px-4 py-2 thick-shadow bg-white border-2 border-black text-sm">History</div>
      <table>
        <thead class="bg-neutral-400">
          <tr>
            <th>Move TxId</th>
            <th>Time</th>
            <th>Co-Ordinates (X</th>
            <th>Y)</th>
            <th>Win</th>
            <th>Reward (ETH)</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="HISTORY.length">
            <tr v-for="move in HISTORY" :key="move.moveTxId">
              <td>{{ move.moveTxId }}</td>
              <td>{{ move.time }}</td>
              <td>{{ move.coordinates.split('-')[0] }}</td>
              <td>{{ move.coordinates.split('-')[1] }}</td>
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
