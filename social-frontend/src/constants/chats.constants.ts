import { IChat } from '@/types';

export const CHATS: IChat[] = [
    {
        id: '1',
        lastMessage: 'Hello from Chat 1',
    },
    {
        id: '2',
        lastMessage: 'Hello from Chat 2',
    },
    {
        id: '3',
        lastMessage: 'Hello from Chat 3',
    },
];

export const GET_CHAT = (id: IChat['id']): IChat | null => {
    return CHATS.find(chat => chat.id === id) || null;
};
