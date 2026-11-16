export interface Message {
    id: number;
    content: string;
    senderId: number;
    conversationId: number;
    createdAt: string;
    updatedAt?: string;
    status?: "sending" | "sent" | "failed";
}

//selcted user details
export interface ChatUser {
    id: number;
    name: string;
    email: string;
    mobile?: string;
    role?: string;
    status?: "Online" | "Offline";
    avatarUrl?: string;
}

//Inside Redux
export interface ChatState {
    selectedUser: ChatUser | null;
    messages: Message[];
    loadingMessages: boolean;
    sendingMessage: boolean;
    onlineUserIds: number[];
    error: string | null;
}

export interface SendMessagePayload {
    receiverId: number;
    content: string;
}