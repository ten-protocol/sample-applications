<script setup lang="ts">
import { useBattleStore } from '../store/battleStore'
import { computed } from 'vue'

const battleStore = useBattleStore()

const reversedMessages = computed(() => {
  return [...battleStore.messages].reverse()
})
</script>

<template>
  <div class="min-w-[500px] h-screen bg-slate-900 pt-[48px] p-6 flex flex-col gap-8">
    <div class="h-[150px] w-full bg-slate-950 rounded-lg p-4">
      <h2 class="text-white text-[12px] font-semibold mb-3">GRAVEYARD</h2>
      <div class="flex flex-wrap gap-3">
        <p
          v-for="ship in battleStore.cpuSunkShips"
          :key="ship.shipType"
          class="text-white text-[12px] font-thin"
        >
          {{ ship.name }} ({{ ship.length }})
        </p>
      </div>
    </div>
    <div
      class="h-full w-full bg-slate-950 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto scroll"
    >
      <p v-for="message in reversedMessages" :key="message.id" class="text-white text-[12px]">
        {{ message.message }}
      </p>
    </div>
  </div>
</template>
