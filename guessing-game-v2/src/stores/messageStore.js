import { defineStore } from 'pinia'
import { Scope } from '../lib/utils'

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
      if (scope === Scope.Competition) {
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
      if (scope === Scope.Competition) {
        return (this.competitionErrorMessage = text)
      }
      this.errorMessage = text
    },
    clearErrorMessage(scope) {
      if (scope === Scope.Competition) {
        return (this.competitionErrorMessage = '')
      }
      this.errorMessage = ''
    }
  }
})
