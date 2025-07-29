'use client';

import styles from './main.module.css';
import { useChatStore } from '@/stores/useChats';
import { GET_CHAT } from '@/constants/chats.constants';
import { useSearchParams } from 'next/navigation';
import { QUERY_CHAT_ID } from '@/constants';
import cn from 'classnames';

export const Main = () => {
    const { selectedChat } = useChatStore();
    const params = useSearchParams();
    const chatId = params.get(QUERY_CHAT_ID) || selectedChat;

    return (
        <main>
            <span className={cn(chatId && styles.invisible, styles.emptyChat)}>
                Select a chat to start messaging
            </span>
            <div className={styles.chatWindow}>
                <div className={styles.chatHeader}>
                    <span className={styles.chatTitle}>{GET_CHAT(chatId as string)?.id}</span>
                </div>
                <div className={cn(!chatId && styles.invisible, styles.chat)}>
                    {JSON.stringify(GET_CHAT(chatId as string))}
                </div>
            </div>
        </main>
    );
};
