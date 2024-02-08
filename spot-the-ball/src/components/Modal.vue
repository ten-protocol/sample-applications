<template>
  <div
    class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
    @click="hideModal"
  >
    <div class="bg-white p-8 rounded-lg">
      <h2 class="text-2xl font-bold">{{ title }}</h2>
      <p class="whitespace-pre-wrap mt-4">{{ message }}</p>
      <div class="flex justify-end">
        <button class="mt-4 py-2 px-4 bg-slate-900 text-white rounded-lg" @click="hideModal">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()

const title = gameStore.modalTitle
const message = gameStore.modalMessage

const hideModal = () => {
  gameStore.hideModal()
}
</script>