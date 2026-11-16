import { AppDataSource } from "../dataSource";
import { Users } from "../entities/User";
import { Conversation } from "../entities/Conversation";
import { Message } from "../entities/Message";

export const conversationRepository = AppDataSource.getRepository(Conversation);
export const userRepository = AppDataSource.getRepository(Users);
export const messageRepository = AppDataSource.getRepository(Message);

export const receiver = async (receiverId: number) => {
    return await userRepository.findOne({
        where: {
            id: receiverId
        }
    })
}

export const conversation = async (loggedInUserId: number, receiverId: number) => {
    return await conversationRepository.findOne({
        where: [
            {
                userOneId: loggedInUserId,
                userTwoId: receiverId
            },
            {
                userOneId: receiverId,
                userTwoId: loggedInUserId
            }
        ]
    })
}

export const createNewConversation = async (loggedInUserId: number, receiverId: number) => {

    const conversation = conversationRepository.create({
        userOneId: loggedInUserId,
        userTwoId: receiverId
    })

    return await conversationRepository.save(conversation)

}

export const getMyConversations = async (userId: number) => {

    const conversations = await conversationRepository.find({
        where: [
            { userOneId: userId },
            { userTwoId: userId }
        ],
        relations: ["user1", "user2"],
        order: { updateAt: "DESC" }
    })

    const result = [];

    for (const conversation of conversations) {

        const targetUser =
            conversation.userOneId === userId ? conversation.user2 : conversation.user1;

        const otherUser = {
            id: targetUser.id,
            name: targetUser.name,
        };

        const lastMessage = await messageRepository.findOne({
            where: {
                conversation: { id: conversation.id },
            },
            relations: ["user"],
            order: { createdAt: "DESC" },
        });

        result.push({
            id: conversation.id,
            otherUser,
            lastMessage,
        });
    }

    return result;
}

export const getConversationById = async (conversationId: number, userId: number) => {

    const conversation = await conversationRepository.findOne({
        where: {id: conversationId},
        relations: ["user1", "user2", "message"]
    })

    if (!conversation) {
        return null;
    }

    if (
        conversation.userOneId !== userId && 
        conversation.userTwoId !== userId
    ) {
        return null;
    }

    const targetUser = conversation.id === userId ? conversation.user2 : conversation.user1

    const otherUser = {
        id: targetUser.id,
        name: targetUser.name
    }

    return {
        id: conversationId,
        otherUser,
        messages: conversation.message
    }
}