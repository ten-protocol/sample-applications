// messageStore.js
import { defineStore } from 'pinia'

export const useMessageStore = defineStore('messages', {
    // State is a function that returns an object
    state: () => ({
        messages: [] // This will hold our messages
    }),
    // Getters are like computed properties for stores
    getters: {
        // You could add getters here if you need to compute derived state
        messageCount(state) {
            return state.messages.length;
        },
        getMessages(state) {
            return state.messages;
        }
    },
    // Actions can be asynchronous and are where you define methods to change state
    actions: {
        addMessage(message) {
            this.messages.push(message)
        },
        removeMessage(index) {
            this.messages.splice(index, 1)
        }
    }
})
