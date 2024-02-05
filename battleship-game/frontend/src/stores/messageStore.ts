import { defineStore } from 'pinia'

export const useMessageStore = defineStore({
  id: 'messageStore',
  state: () => ({
    messages: [] as { id: number; text: string }[],
    errorMessage: ''
  }),
  actions: {
    addMessage(text) {
      this.messages.push({
        id: Date.now(),
        text: text
      })
    },
    addErrorMessage(text) {
      this.errorMessage = text
    },
    clearErrorMessage() {
      this.errorMessage = ''
    }
  }
})
