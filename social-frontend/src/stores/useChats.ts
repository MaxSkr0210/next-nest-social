import { create } from 'zustand';
import { IChat } from '@/types';

interface IStoreValues {
    selectedChat: IChat['id'] | null;
}

interface IStore extends IStoreValues {
    update: (value: IChat['id']) => void;
}

export const useChatStore = create<IStore>(set => ({
    selectedChat: null,
    update: (value: IChat['id']) =>
        set({
            selectedChat: value,
        }),
}));
