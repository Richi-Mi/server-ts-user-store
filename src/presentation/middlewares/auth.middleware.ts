import { NextFunction, Request, Response } from "express";
import { TokenAdapter } from "../../config";
import { User } from "../../data";
import { UserEntity } from "../../domain";

export class AuthMiddleware {
    public static async validateToken(req: Request, res: Response, next: NextFunction ) {
        const authorization = req.header('Authorization')

        if(!authorization) return res.status(401).json({ error: 'No token provided'})
        if(!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'No bearer token provided'})
        
        const token = authorization.split(' ').at(1) || ''

        try {
            const payload = await TokenAdapter.validateToken<{id: string}>(token)
            if(!payload) return res.status(401).json({ error: 'Invalid token' })

            const user = await User.findById(payload.id)
            if(!user) return res.status(401).json({ error: 'User not found' })

            req.body.user = UserEntity.fromObject(user);

            next();
        }
        catch( error ) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}