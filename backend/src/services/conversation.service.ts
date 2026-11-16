import { receiver, conversation, createNewConversation, getMyConversations, getConversationById } from "../repository/conversation.repository";

export const createOrGetConversation = async (loggedInUserId: number, receiverId: number) => {

    if (loggedInUserId === receiverId) {
        throw new Error("You can't create conversation with yourself")
    }

    const isReceiverExist = await receiver(receiverId);

    if (!isReceiverExist) {
        throw new Error("Receiver user not found")
    }

    const existingConversation = await conversation(loggedInUserId, receiverId);

    if (existingConversation) {
        return {
            conversation: existingConversation,
            created: false
        }
    }

    const newConversation = await createNewConversation(loggedInUserId, receiverId);

    return {
        conversation: newConversation,
        created: true
    }
}

export const getAllMyConversations = async (userId: number) => {
    return await getMyConversations(userId);
}

export const getConversationsById = async (conversationId: number, userId: number) => {
    return await getConversationById(conversationId, userId);
}