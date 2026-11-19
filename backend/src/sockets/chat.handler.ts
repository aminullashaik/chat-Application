import { Socket, Server } from "socket.io";
import { AppDataSource } from "../dataSource";
import { Conversation } from "../entities/Conversation";
import { Message } from "../entities/Message";

const onlineUsers: Record<number, string[]> = {}

export const registerChatHandler = (io: Server, socket: Socket) => {

    const userId = socket.data.user.id
    if (!userId) return socket.disconnect();

    if (!onlineUsers[userId]) {
        onlineUsers[userId] = []
    }

    if (!onlineUsers[userId].includes(socket.id)) {
        onlineUsers[userId].push(socket.id)
    }

    if (onlineUsers[userId].length === 1) {
        socket.broadcast.emit("user_status_change", { userId, "isOnline": true })
    }

    socket.emit("initial_online_users", Object.keys(onlineUsers).map(Number))

    socket.on("join_conversation", async (payload: any) => {

        try {

            const rawId = payload && typeof payload === "object" ? payload.conversationId : payload
            const conversationId = Number(rawId);

            if (!Number.isInteger(conversationId) || conversationId < 0) {
                socket.emit("error_message", { message: "Invalid conversationId" })
            }

            const roomName = `Conversation_${conversationId}`;

            if (!socket.rooms.has(roomName)) {

                const conversation = await AppDataSource.getRepository(Conversation).findOne({
                    where: { id: conversationId },
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

            socket.emit("joined_conversation", { conversationId });

        } catch (err: any) {
            console.error(`Error in join conversation (user ${userId}):`, err);
            socket.emit("error_message", { message: "Failed to join conversation" })
        }
    })

    socket.on("send_message", async (data: any) => {
        try {

            const conversationId = Number(data?.conversationId);
            const content = typeof data?.content === 'string' ? data.content.trim() : ''

            if (!Number.isInteger(conversationId) || conversationId < 0 || !content) {
                return socket.emit("error_message", { message: "Invalid message data" })
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
                    conversation: { id: conversationId },
                    user: { id: userId }
                })
            )

            io.to(roomName).emit("receive_message", {
                id: saved.id,
                conversationId,
                senderId: userId,
                content: saved.content,
                createdAt: saved.createdAt
            })

            socket.to(roomName).emit("user_stop_typing", {
                conversationId,
                userId,
            });

        } catch (err: any) {
            console.error(`Error in send_message (User: ${userId}): `, err);
            socket.emit("error_message", { message: "Failed to send message." })
        }
    })

    socket.on("typing", (data: any) => {

        const conversationId = Number(data?.conversationId)
        if (!Number.isInteger(conversationId)) return;

        const roomName = `Conversation_${conversationId}`

        if (!socket.rooms.has(roomName)) return;

        socket.to(roomName).emit("user_typing", {
            conversationId,
            userId
        })

    })

    socket.on("stop_typing", (data: any) => {
        const conversationId = Number(data?.conversationId);
        if (!Number.isInteger(conversationId) || conversationId < 0) return;

        const roomName = `Conversation_${conversationId}`;
        if (!socket.rooms.has(roomName)) return;

        socket.to(roomName).emit("user_stop_typing", {
            conversationId,
            userId
        })
    })

    socket.on("disconnect", () => {
        const userSockets = onlineUsers[userId];
        if (!userSockets) return;

        onlineUsers[userId] = userSockets.filter((id) => id !== socket.id);

        if (onlineUsers[userId].length === 0) {
            delete onlineUsers[userId];
            io.emit("user_status_change", {
                userId,
                isOnline: false,
                lastSeen: new Date().toISOString()
            });
        }
    });

}