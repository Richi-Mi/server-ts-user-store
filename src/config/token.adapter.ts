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
    static validateToken = <T>(token: string) : Promise<T|null> => {
        return new Promise((resolve) => {
            jwt.verify(token, SEED, (err, decoded) => {

                if (err) return resolve(null);
            
                resolve(decoded as T);
            
            });
        });
    }
}