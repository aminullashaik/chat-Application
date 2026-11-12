import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

// In-memory registry to store online users: key = userId, value = socketId
const onlineUsers = new Map<number, string>();

export const initSocket = (httpServer: HTTPServer) => {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: "http://localhost:5173", // Vite frontend URL
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket: Socket) => {
        console.log(`🔌 New client connected. Socket ID: ${socket.id}`);

        // 1. User registers their presence when logging in
        socket.on("user_connected", (userId: number) => {
            onlineUsers.set(userId, socket.id);
            console.log(`👤 User with ID ${userId} is ONLINE (Socket: ${socket.id})`);

            // Broadcast the full list of online user IDs to all connected clients
            io.emit("get_online_users", Array.from(onlineUsers.keys()));
        });

        // 2. Handle client disconnect (user closes browser tab or logs out)
        socket.on("disconnect", () => {
            console.log(`❌ Client disconnected. Socket ID: ${socket.id}`);

            // Find which user owned this socket ID and remove them
            for (const [userId, sockId] of onlineUsers.entries()) {
                if (sockId === socket.id) {
                    onlineUsers.delete(userId);
                    console.log(`👤 User with ID ${userId} is now OFFLINE`);
                    break;
                }
            }

            // Broadcast the updated online list to remaining users
            io.emit("get_online_users", Array.from(onlineUsers.keys()));
        });
    });

    return io;
};