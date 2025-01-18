import jwt from "jsonwebtoken";
import { User } from "../types";
import { NextFunction, Request, Response } from "express";

export class AuthMiddleware {
    verifyJWT(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            
            if (!token) {
                throw new Error("Unauthorized request");
            }
            const user = jwt.verify(token, process.env.JWT_SECRET as string) as User;
            
            if (!user || user.user_id === null) {
                return res.status(500).json({ message: "Invalid access token" });
            }
            req.user = user;
            next();
        } catch (error: any) {
            return res.status(401).json({ message: error.message || "Invalid access token", code: 401 });
        }
    }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();