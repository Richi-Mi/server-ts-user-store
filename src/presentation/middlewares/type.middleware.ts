import { NextFunction, Request, Response } from "express";

export class CheckTypeMiddleware {

    public static checkTypes = (validTypes: string[]) => {
        return (req: Request, res: Response, next: NextFunction) => {
            const { type } = req.params;
            if (!validTypes.includes(type)) {
                return res.status(400).json({ msg: 'Invalid type' });
            }
            next();
        };
    }
}