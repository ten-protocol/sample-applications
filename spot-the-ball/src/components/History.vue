<template>
  <div class="wrapper py-8">
    <div class="w-fit mx-auto">
      <div class="flex justify-between">
        <div
          class="w-fit px-4 py-2 thick-shadow bg-white border-2 border-black text-sm border-r-8 border-b-8"
        >
          History
        </div>
        <div class="flex items-center gap-2 text-sm">
          <input type="checkbox" @change="getPreviousWins" :checked="showPreviousWins" />
          <label>See previous wins</label>
        </div>
      </div>
      <table v-if="showPreviousWins">
        <thead class="bg-neutral-400">
          <tr>
            <th></th>
            <th>
              <p>Top Guesses</p>
              <p>(address, distance)</p>
            </th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="previousWins?.length">
            <tr v-for="(win, index) in previousWins" :key="index">
              <td>{{ win.name }}</td>
              <td>
                <p v-for="(guess, index) in win.topGuessesArray" :key="index">
                  <span> {{ guess[0].slice(0, 6) }}...{{ guess[0].slice(-4) }} </span>,
                  <span> {{ guess[1] }} </span>
                </p>
              </td>
              <td>
                <button
                  class="py-2 px-4 bg-slate-900 text-white rounded-lg"
                  @click="convertImageToBase64(win.privateImageURL)"
                >
                  Preview
                </button>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="6"><p class="text-center">There are no previous wins yet</p></td>
          </tr>
        </tbody>
      </table>
      <table v-if="showHistory">
        <thead class="bg-neutral-400">
          <tr>
            <th></th>
            <th>Time</th>
            <th>X Coordinate</th>
            <th>Y Coordinate</th>
            <th>Win</th>
            <th>Reward (ETH)</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="HISTORY?.length">
            <tr v-for="(move, index) in HISTORY" :key="index">
              <td>{{ index + 1 }}</td>
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
    <!-- // modal image`` -->
    <div
      id="imagePreview"
      class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
      v-if="imageToPreview"
    >
      <div class="bg-white p-8 rounded-lg">
        <img :src="imageToPreview" alt="winning image" />
        <div class="flex justify-end">
          <button
            class="mt-4 py-2 px-4 bg-slate-900 text-white rounded-lg"
            @click="closeImageModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()

const HISTORY = ref(gameStore.history)
const previousWins = ref(gameStore.previousWins)
const showPreviousWins = ref(false)
const showHistory = ref(true)

const imageToPreview = ref('')

watchEffect(() => {
  HISTORY.value = gameStore.history
  previousWins.value = gameStore.previousWins
})

const closeImageModal = () => {
  history.pushState('', document.title, window.location.pathname + window.location.search)
  imageToPreview.value = ''
}

const getPreviousWins = async () => {
  try {
    showPreviousWins.value = !showPreviousWins.value
    showHistory.value = !showHistory.value
    if (showPreviousWins.value) {
      await gameStore.getPreviousWins()
    }
  } catch (error) {
    console.error(error)
  }
}

// to prevent the user from knowing the image url, we will use the image url from the server
// by converting the image to base64 and sending it to the server
const convertImageToBase64 = async (imageURL) => {
  try {
    const response = await fetch(imageURL)
    const blob = await response.blob()
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = () => {
      console.log(reader.result)
      imageToPreview.value = reader.result
      location.href = '#imagePreview'
    }
  } catch (error) {
    console.error(error)
  }
}
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
