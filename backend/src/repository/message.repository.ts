import { AppDataSource } from "../dataSource";
import { Message } from "../entities/Message";
import { Conversation } from "../entities/Conversation";

const messageRepository = AppDataSource.getRepository(Message);
const conversationRepository = AppDataSource.getRepository(Conversation);

export const getMessages = async (conversationId: number, userId: number) => {

    const conversation = await conversationRepository.findOne({
        where: {
            id: conversationId
        }
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

    const messages = await messageRepository.find({
        where: {
            conversation: {id: conversationId}
        },
        relations:['user'],
        select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
                id: true,
                name: true,
                role: true,
                status:true
            }
        },
        order: {
            createdAt: "ASC"
        }
    })

    return messages;
}

export const editMessage = async (messageId: number, userId: number, content: string) => {
    const message = await messageRepository.findOne({
        where: {
            id: messageId,
            user: {id: userId}
        }
    })

    if (!message) {
        return null;
    }

    message.content = content;

    return await messageRepository.save(message)
}

export const deleteMessage = async (messageId: number, userId: number) => {

    const message = await messageRepository.findOne({
        where: {
            id: messageId,
            user: {id: userId}
        }
    })

    if (!message) {
        return null;
    }

    await messageRepository.softDelete(messageId);

    return true;
}