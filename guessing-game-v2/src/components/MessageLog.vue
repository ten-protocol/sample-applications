<template>
  <div class="message-log">
    <div v-for="message in messages" :key="message.id" class="message">{{ message.text }}</div>
  </div>
</template>

<script>
import { useMessageStore } from '@/stores/messageStore'

export default {
  name: 'MessageLog',
  setup() {
    const messageStore = useMessageStore()

    return {
      messages: messageStore.messages
    }
  }
};
</script>

<style scoped>
.message-log {
  background-color: black;
  color: #00FF00;
  padding: 20px;
  border-radius: 5px;
  width: 100%;
  max-width: 100vh;
  max-height: 300px;
  overflow-y: auto;
  font-family: 'Courier New', Courier, monospace;
  box-shadow: inset 0 0 10px #00FF00;
}

.message {
  margin-bottom: 10px;
}
</style>
