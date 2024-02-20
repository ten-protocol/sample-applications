<script setup lang="ts">
import { useMessageStore } from '../stores/messageStore'
import { computed } from 'vue'

const messageStore = useMessageStore()

const reversedMessages = computed(() => {
  return [...messageStore.messages].reverse()
})

const getMessageClass = (index: number) => {
  if (index === 0) return 'first-message'
  if (index === 1) return 'second-message'
  return 'other-messages'
}
</script>

<template>
  <div
    class="min-w-[500px] bg-slate-950 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto scroll message-log h-[300px]"
  >
    <p
      v-for="(message, index) in reversedMessages"
      :key="message.id"
      :class="['text-white text-[12px] message', getMessageClass(index)]"
    >
      {{ message.text }}
    </p>
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
