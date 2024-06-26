<script setup lang="ts">
import { useBattleStore } from '../stores/battleStore'
import { useMessageStore } from '../stores/messageStore'
import { computed, ref, watchEffect } from 'vue'
import { useWalletStore } from '../stores/walletStore'

const battleStore = useBattleStore()
const messageStore = useMessageStore()
const walletStore = useWalletStore()

const isConnected = ref(walletStore.isConnected)

const sunkShipsCount = ref(battleStore.sunkShipsCount)

const reversedMessages = computed(() => {
  return [...messageStore.messages].reverse()
})

const getMessageClass = (index) => {
  if (index === 0) return 'first-message'
  if (index === 1) return 'second-message'
  return 'other-messages'
}

watchEffect(() => {
  sunkShipsCount.value = battleStore.sunkShipsCount
  isConnected.value = walletStore.isConnected
})
</script>

<template>
  <div class="min-w-[500px] h-screen bg-slate-900 pt-[48px] p-6 flex flex-col gap-8">
    <div class="h-[150px] w-full bg-slate-950 rounded-lg p-4">
      <h2 class="text-white text-[12px] font-semibold mb-3">LEGEND</h2>
      <div class="flex flex-wrap gap-3" v-if="isConnected">
        <div class="flex items-center gap-2">
          <div class="w-[20px] h-[20px] bg-blue rounded-lg"></div>
          <p class="text-white text-[12px] font-bold">Hit cells/Missed shots</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-[20px] h-[20px] bg-red rounded-lg"></div>
          <p class="text-white text-[12px] font-bold">Sunk ships</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-[20px] h-[20px] bg-lightcoral rounded-lg"></div>
          <p class="text-white text-[12px] font-bold">Selected cell</p>
        </div>
      </div>
      <p class="text-white text-sm font-bold" v-else>Connect your wallet to start playing</p>
    </div>
    <div class="h-[150px] w-full bg-slate-950 rounded-lg p-4">
      <h2 class="text-white text-[12px] font-semibold mb-3">GRAVEYARD</h2>
      <div class="flex flex-wrap gap-3">
        <p class="text-white text-3xl font-bold" v-if="isConnected">
          {{ sunkShipsCount > 0 ? sunkShipsCount + '/249' : '' }}
          <span class="text-sm">{{ sunkShipsCount > 0 ? 'ships sunk' : 'No ships sunk yet' }}</span>
        </p>
        <p class="text-white text-sm font-bold" v-else>Connect your wallet to start playing</p>
      </div>
    </div>
    <div
      class="h-full w-full bg-slate-950 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto scroll message-log"
    >
      <p
        v-for="(message, index) in reversedMessages"
        :key="message.id"
        :class="['text-white text-[12px] message', getMessageClass(index)]"
      >
        {{ message.text }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.message-log {
  color: #00ff00;
  padding: 20px;
  border-radius: 5px;
  overflow-y: auto;
  box-shadow: inset 0 0 10px #00ff00;
}

.message {
  margin-bottom: 10px;
  font-family: 'Courier New', Courier, monospace !important;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.first-message {
  color: #00ff00;
  animation: typing 2s steps(25, end) 0s 1 normal both;
  overflow: hidden;
  white-space: nowrap;
}

.second-message {
  color: #49cc49;
}

.other-messages {
  color: #3dab3d;
}
</style>

