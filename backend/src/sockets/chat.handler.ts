import { Socket, Server } from "socket.io";
import { AppDataSource } from "../dataSource";
import { Conversation } from "../entities/Conversation";
import { Message } from "../entities/Message";

export const registerChatHandler = (io: Server, socket: Socket) => {

    const userId = socket.data.user.id

    socket.on("join_conversation", async (payload: any) => {

        try {

            const rawId = payload && typeof payload === "object" ? payload.conversationId : payload
            const conversationId = Number(rawId);

            if (!Number.isInteger(conversationId) || conversationId < 0) {
                socket.emit("error_message", {message: "Invalid conversationId"})
            }

            const roomName = `Conversation_${conversationId}`;

            if (!socket.rooms.has(roomName)) {

                const conversation = await AppDataSource.getRepository(Conversation).findOne({
                    where : {id: conversationId},
                    select: ['id', 'userOneId', 'userTwoId']
                })

                if (
                    !conversation || 
                    (conversation.userOneId !== userId && conversation.userTwoId !== userId)
                ) {
                    return socket.emit("error_message", {
                        message: "Invalid conversaion or unauthorized"
                    })
                }

                await socket.join(roomName)

            }

            socket.emit("joined_conversation", {conversationId});

        } catch (err : any) {
            console.error(`Error in join conversation (user ${userId}):`, err);
            socket.emit("error_message", {message: "Failed to join conversation"})
        }
    })

    socket.on("send_message", async (data: any) => {
        try {

            const conversationId = Number(data?.conversationId);
            const content = typeof data?.content === 'string' ? data.content.trim() : ''

            if (!Number.isInteger(conversationId) || conversationId < 0 || !content) {
                return socket.emit("error_message", {message: "Invalid message data"})
            }

            const roomName = `Conversation_${conversationId}`

            if (!socket.rooms.has(roomName)) {
                return socket.emit("error_message", {
                    message: "You must join the conversation before sending message"
                })
            }

            const messageRepo = AppDataSource.getRepository(Message);
            const saved = await messageRepo.save(
                messageRepo.create({
                    content,
                    conversation: {id: conversationId},
                    user: {id: userId}
                })
            )

            io.to(roomName).emit("receive_message", {
                id: saved.id,
                conversationId,
                senderId: userId,
                content: saved.content,
                createdAt: saved.createdAt
            })

        } catch (err : any) {
            console.error(`Error in send_message (User: ${userId}): `, err);
            socket.emit("error_message", {message: "Failed to send message."})
        }
    })
}