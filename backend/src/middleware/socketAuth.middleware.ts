import { Socket, ExtendedError } from "socket.io";
import jwt from "jsonwebtoken";
import { AuthUser, JWT_SECRET } from "./auth.middleware";

export const socketAuthMiddleware = (
    socket: Socket,
    next: (err?: ExtendedError) => any
) => {
    try {

        const authHeader = socket.handshake.headers.authorization; //Browser, socket.io 
        const rawToken = socket.handshake.auth?.token || authHeader; //Postman, standard http header

        if (typeof rawToken !== "string" || !rawToken.trim()) {
            next(new Error("Unauthorized: Token Missing"))
        }

        const token = rawToken.startsWith("Bearer ") ? rawToken.split(" ") : rawToken

        socket.data.user = jwt.verify(token, JWT_SECRET) as AuthUser;

        return next();

    } catch (err : any) {
        console.error('Set socket error: ', err)
        return next(new Error("Unauthorized: Invalid Token"))
    }
}