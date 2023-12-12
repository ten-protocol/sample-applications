<template>
  <div class="message-log">
    <div
      v-for="(message, index) in reversedMessages"
      :key="message.id"
      :class="['message', getMessageClass(index)]"
    >
      {{ message }}
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useMessageStore } from "@/store/messageStore";

export default {
  name: "MessageLog",
  setup() {
    const messageStore = useMessageStore();

    const reversedMessages = computed(() => {
      return [...messageStore.messages].reverse();
    });

    const getMessageClass = (index) => {
      if (index === 0) return "first-message";
      if (index === 1) return "second-message";
      return "other-messages";
    };

    return {
      reversedMessages,
      getMessageClass,
    };
  },
};
</script>

<style scoped>
.message-log {
  color: azure;
  background-color: black;
  padding: 20px;
  border-radius: 5px;
  height: 15rem;
  overflow-y: auto;
  font-family: "Courier New", Courier, monospace;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.second-message {
  opacity: 0.8;
}

.other-messages {
  opacity: 0.5;
}
</style>