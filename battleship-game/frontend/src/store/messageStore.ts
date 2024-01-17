import { defineStore } from 'pinia'
import { Message } from '../types'

export const useMessageStore = defineStore('messages', {
  state: () => ({
    messages: [] as Message[]
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
    addMessage(message: Message) {
      this.messages.push(message)
    },
    removeMessage(index: number) {
      this.messages.splice(index, 1)
    }
  }
})
