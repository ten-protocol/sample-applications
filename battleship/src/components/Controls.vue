<script setup lang="ts">
import { useMessageStore } from '../store/messageStore'
import { computed } from 'vue'
import MetaMaskConnectButton from './MetaMaskConnectButton.vue'

const messageStore = useMessageStore()

const reversedMessages = computed(() => {
  return [...messageStore.messages].reverse()
})
</script>

<template>
  <div class="w-[500px] h-[calc(100vh-48px)] bg-slate-900 p-6 flex flex-col justify-between">
    <MetaMaskConnectButton />

    <div
      class="h-[80%] w-full bg-slate-950 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto scroll"
    >
      <p v-for="message in reversedMessages" :key="message.id" class="text-white text-[12px]">
        {{ message.message }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.message-log {
  background-color: black;
  color: #00ff00;
  padding: 20px;
  border-radius: 5px;
  width: 100%;
  max-width: 100vh;
  max-height: 300px;
  overflow-y: auto;
  font-family: 'Courier New', Courier, monospace;
  box-shadow: inset 0 0 10px #00ff00;
}

.message {
  margin-bottom: 10px;
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