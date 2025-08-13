import { regularExps } from "../../../config";

export class LoginUserDTO {
    private constructor(
        public readonly email: string,
        public readonly password: string
    ) {}

    static create(obj: {[key: string]: any}): [string?, LoginUserDTO?] {
        const { email, password } = obj;

        if( !regularExps.email.test(email) )
            return ['Email is invalid'];
        if( !password )
            return ['Password is required'];

        return [undefined, new LoginUserDTO(email, password)];
    }
}