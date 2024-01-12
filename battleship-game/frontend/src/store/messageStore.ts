import { defineStore } from 'pinia'

export const useMessageStore = defineStore('messages', {
  state: () => ({
    messages: [] as string[]
  }),

  getters: {
    messageCount(state) {
      return state.messages.length
    },
    getMessages(state) {
      return state.messages
    }
  },

  actions: {
    addMessage(message: string) {
      this.messages.push(message)
    },
    removeMessage(index: number) {
      this.messages.splice(index, 1)
    }
  }
})
