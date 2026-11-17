import type { User } from "./userTypes";

export interface Message {
    id: number;
    content: string;
    senderId: number;
    conversationId?: number;
    createdAt: string;
    updatedAt?: string;
    status?: "sending" | "sent" | "failed";
}


//Inside Redux
export interface ChatState {
    selectedUser: User | null;
    conversationId: number | null;
    messages: Message[];
    loadingMessages: boolean;
    sendingMessage: boolean;
    onlineUserIds: number[];
    error: string | null;
}

export interface SendMessagePayload {
    conversationId: number;
    content: string;
}