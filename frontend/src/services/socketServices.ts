import { connect, io, type Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
let socket: Socket | null = null;

export const connectSocket = (): Socket => {
    if(socket){
        if(!socket.connected){
            socket.connect();
        }
        return socket;
    }

    const token = sessionStorage.getItem("token");

    socket = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket", 'polling'],
        withCredentials: true,
        autoConnect: true,
    });

    socket.on("connect", () => {
        console.log("socket connected successfully ID:", socket?.id);

    });

    socket.on("disconnect",(reason) => {
        console.warn("socket disconnected:", reason);
    });

    socket.on("connect_error", (error)=> {
        console.error("Socket connect error:", error.message);
    });
    return socket;
};
export const getSocket = (): Socket | null => {
    return socket;
};

export const disconnectSocket = (): void => {
    if(socket){
        socket.disconnect();
        socket = null;
        console.log("socket disconnected and cleaned up");
    }
};