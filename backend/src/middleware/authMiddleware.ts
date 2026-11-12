import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const JWT_SECRET = "aminulla_serect_1805";

export interface AuthUser {
    id: number,
    role : string
}
export interface AuthRequest extends Request {
    user? : any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");
    const token = authHeader?.split(" ")[1];

    if(!token){
        return res.status(403).json({message: "Access Denied: No token"});
    }
    try {
        const verifiedUser =jwt.verify(token, JWT_SECRET) as AuthUser;
        req.user =verifiedUser;
        next();
    } catch(error) {
        res.status(401).json({message: "Access Denied: Inavlid token"});
    }
}