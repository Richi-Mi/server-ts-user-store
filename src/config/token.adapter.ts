import jwt from "jsonwebtoken";
import { envs } from "./envs";

const SEED = envs.SECRET_KEY

export class TokenAdapter {
    static generateToken = ( payload : any ) => {
        return new Promise( (resolve) => {
            jwt.sign(payload, SEED, { expiresIn: '2h' }, (err, token) => {
                if( err ) resolve(null)
                resolve(token);
            })
        })
    }
    static validateToken = (token: string) => {
        throw new Error("Method not implemented.");
    }
}