<template>
  <div class="message-log">
    <div
      v-for="(message, index) in reversedMessages"
      :key="message.id"
      :class="['message', getMessageClass(index)]"
    >
      <p v-html="message.text"></p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useMessageStore } from '@/stores/messageStore'

export default {
  name: 'MessageLog',
  props: {
    scope: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const messageStore = useMessageStore()

    const reversedMessages = computed(() => {
      if (props.scope === 'home') {
        return messageStore.messages.slice().reverse()
      }
      return messageStore.competitionMessages.slice().reverse()
    })

    const getMessageClass = (index) => {
      if (index === 0) return 'first-message'
      return 'other-messages'
    }

    return {
      reversedMessages,
      getMessageClass
    }
  }
}
</script>

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
