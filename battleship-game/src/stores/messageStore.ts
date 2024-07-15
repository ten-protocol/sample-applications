import { create } from 'zustand';

export type MessageType = 'INFO' | 'ERROR' | 'SUCCESS';

export type Message = { id: number; text: string; type: MessageType }

export type MessageStore = {
    messages: Message[];
    errorMessage: string;
    addNewMessage: (msg: string, type?: MessageType) => void;
};

export const useMessageStore = create<MessageStore>((set) => ({
    messages: [],
    errorMessage: '',

    addNewMessage: (text, type = 'INFO') => {
        set((state) => ({
            messages: [
                ...state.messages,
                {
                    id: Date.now(),
                    text: text,
                    type,
                },
            ],
        }));
    },
}));
