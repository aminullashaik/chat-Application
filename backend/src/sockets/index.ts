import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { config } from "../config/env";
import { socketAuthMiddleware } from "../middleware/socketAuth.middleware";
import { registerChatHandler } from "./chat.handler";

export const initSocketServer = (httpServer: HttpServer) => {

    const io = new Server(httpServer, {
        cors: {
            origin: config.clientUrl,
            credentials: true
        }
    })

    io.use(socketAuthMiddleware);

    io.on("connection", (socket) => {
        console.log(`User ${socket.data.user.id} connected (Socket: ${socket.id})`)

        registerChatHandler(io, socket);

        socket.on("disconnect", () => {
            console.log(`User ${socket.data.user.id} disconnected`);
        })
    })

    return io;
}