import { defineStore } from 'pinia'

export const useMessageStore = defineStore({
  id: 'messageStore',
  state: () => ({
    messages: [],
    competitionMessages: [],
    errorMessage: '',
    competitionErrorMessage: ''
  }),
  actions: {
    addMessage(text, scope) {
      if (scope === 'competition') {
        return this.competitionMessages.push({
          id: Date.now(),
          text: text
        })
      }
      this.messages.push({
        id: Date.now(),
        text: text
      })
    },
    addErrorMessage(text, scope) {
      if (scope === 'competition') {
        return (this.competitionErrorMessage = text)
      }
      this.errorMessage = text
    },
    clearErrorMessage(scope) {
      if (scope === 'competition') {
        return (this.competitionErrorMessage = '')
      }
      this.errorMessage = ''
    }
  }
})
