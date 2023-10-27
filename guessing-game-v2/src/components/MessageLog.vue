<template>
  <div class="message-log">
    <div v-for="(message, index) in reversedMessages"
         :key="message.id"
         :class="['message', getMessageClass(index)]">{{ message.text }}</div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useMessageStore } from '@/stores/messageStore'

export default {
  name: 'MessageLog',
  setup() {
    const messageStore = useMessageStore()

    const reversedMessages = computed(() => {
      return [...messageStore.messages].reverse()
    })

    const getMessageClass = (index) => {
      if (index === 0) return 'first-message';
      if (index === 1) return 'second-message';
      return 'other-messages';
    }

    return {
      reversedMessages,
      getMessageClass
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

.first-message {
  color: #00FF00; /* Brightest color */
}

.second-message {
  color: #49cc49; /* Duller green, but you can adjust to your preference */
}

.other-messages {
  color: #3dab3d; /* Dullest green, adjust to your preference */
}
</style>
