import { create } from 'zustand';

export interface IMessageStore {
    messages: { id: number; text: string; type: MessageType }[];
    errorMessage: string;
    addNewMessage: (msg: string, type?: MessageType) => void;
}

type MessageType = 'INFO' | 'ERROR' | 'SUCCESS';

export const useMessageStore = create((set) => ({
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
