import { useState } from 'react';
import { IChat } from '@/types';

export const useChat = () => {
    const [selectedChat, setSelectedChat] = useState<IChat | null>(null);

    return { selectedChat, setSelectedChat };
};
