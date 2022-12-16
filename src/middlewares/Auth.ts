import { NextFunction, Response,Request } from "express";
import jwt from "jsonwebtoken";


type AuthRequest = Request & { userId?: number };
interface JWT_DECODE {
    id: number;
    username: string;
    iat: number;
    exp: number;
}

export const Auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) {
            res.status(404).json({
                success: false,
                message: 'Unauthorized / no token found',
            });
        } else {
            const data = jwt.verify(token, process.env.TOKEN_SECRET!) as JWT_DECODE;
            req.userId = data.id;
            next();
        }
    } catch (error) {
        return  res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}