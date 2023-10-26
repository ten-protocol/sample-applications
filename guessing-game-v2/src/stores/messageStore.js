import { defineStore } from 'pinia';

export const useMessageStore = defineStore({
    id: 'messageStore',
    state: () => ({
        messages: []
    }),
    actions: {
        addMessage(text) {
            this.messages.push({
                id: Date.now(),
                text: text
            });
        }
    }
})
