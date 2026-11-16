import { io, type Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

let socket: Socket | null = null;

export const connectSocket = (userId: number): Socket => {
    if(socket && socket.connected) {
        return socket;
    }

    socket = io(SOCKET_URL, {
        transports: ["websocket", 'polling'],
        withCredentials: true,
        autoConnect: true,
    });

    socket.on("connect", () => {
        console.log("socket connected successfully ID:", socket?.id);

    //tells backend who is the user
    socket?.emit("register_user", userId);
    });

    socket.on("dissconnet",(reson) => {
        console.warn("socket dissconnected:", reson);
    });

    socket.on("connect_error", (error)=> {
        console.error("Socket connect error:", error.message);
    });
    return socket;
};
export const getSocket = (): Socket | null => {
    return socket;
};

export const dissconnectSocket = (): void => {
    if(socket){
        socket.disconnect();
        socket = null;
        console.log("socket disconnected and cleaned up");
    }
};