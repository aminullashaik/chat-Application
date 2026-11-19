import { getMessages, editMessage, deleteMessage } from "../repository/message.repository";

export const getConversationMessages = async (conversationId: number, userId: number) => {
    return await getMessages(conversationId, userId)
}

export const editMessageService = async (messageId: number, userId: number, content: string) => {
    return await editMessage(messageId, userId, content);
}

export const removeMessage = async (messageId: number, userId: number) => {
    return await deleteMessage(messageId, userId);
}