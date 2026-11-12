import { Socket, Server as SocketIOServer } from "socket.io";
import {Server as HTTPServer} from "http";

//key = userID, value = socketId
const onlineUser = new Map<number, string>();

export const initSocket = (httpServer: HTTPServer) => {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket: Socket) => {
        console.log(`New client connected. Socket ID: ${socket.id}`);

        io.emit("get_online_users", Array.from(onlineUser.keys()));
    });


}