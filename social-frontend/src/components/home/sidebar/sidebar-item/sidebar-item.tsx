import styles from './sidebar-item.module.css';
import Image from 'next/image';
import { IChat } from '@/types';
import { HTMLAttributes } from 'react';

interface SidebarItemProps extends HTMLAttributes<HTMLDivElement> {
    chat: IChat;
}

export const SidebarItem = ({ chat, onClick, ...props }: SidebarItemProps) => {
    return (
        <div {...props} className={styles.sidebarItem} onClick={onClick}>
            <div className={styles.userIcon}>
                <Image src={'/images/icons/user.svg'} alt={'user-icon'} height={25} width={25} />
            </div>
            <div className={styles.chatInfo}>
                <div className={styles.chatName}>{chat.id}</div>
                <div className={styles.chatMessage}>{chat.lastMessage}</div>
            </div>
        </div>
    );
};
