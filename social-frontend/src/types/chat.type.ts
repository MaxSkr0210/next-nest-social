export interface IChat {
    id: string;
    lastMessage?: string;
    lastMessageTime?: Date;
    unreadCount?: number;
    participants?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}
