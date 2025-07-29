'use client';

import styles from './sidebar.module.css';
import { SidebarItem } from '@/components/home/sidebar/sidebar-item/sidebar-item';
import { CHATS } from '@/constants/chats.constants';
import { IChat } from '@/types';
import { useChatStore } from '@/stores/useChats';
import { useRouter } from 'next/navigation';
import { QUERY_CHAT_ID } from '@/constants';

export const Sidebar = () => {
    const { update } = useChatStore();
    const router = useRouter();

    const selectChat = (chatId: IChat['id']) => {
        update(chatId);
        router.push(`?${QUERY_CHAT_ID}=` + chatId);
    };

    return (
        <aside className={styles.sidebar}>
            <div>user</div>
            <div className={styles.chats}>
                {CHATS.map(chat => (
                    <SidebarItem chat={chat} key={chat.id} onClick={() => selectChat(chat.id)} />
                ))}
            </div>
        </aside>
    );
};
