export interface ChannelMember{
    id: number;
    name: string;
    email: string;
    mobile: string;
    userRole?: "admin" | "member";
}

export interface Channel {
    id: number;
    name: string;
    description?: string;
    createdBy: string;
    createdAt: string | Date;
    updatedAt?: string | Date;
    deletdAt?: string | Date | null;
    members? : ChannelMember[];
}

export interface ChannelMessage {
    id: number;
    channelId: number;
    senderId: number;
    content: string;
    createdAt: string | Date;
    sender: {
        id: number;
        name: string;
        avathar?: string;
    };
}

export interface CreateChannelPayload {
    name: string;
    description: string;
    memberIds: number[];
}