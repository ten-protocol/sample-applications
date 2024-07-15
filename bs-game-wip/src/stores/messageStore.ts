import { create } from 'zustand';

export type MessageStore = {
    messages: { id: number; text: string; type: MessageType }[];
    errorMessage: string;
    addNewMessage: (msg: string, type?: MessageType) => void;
};

type MessageType = 'INFO' | 'ERROR' | 'SUCCESS';

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
