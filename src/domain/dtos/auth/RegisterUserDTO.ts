import { regularExps } from "../../../config";

export class RegisterUserDTO {
    private constructor(
        public readonly email: string,
        public readonly name: string,
        public readonly password: string,
    ) {}

    static create(object: { [key: string]: any }) : [string?, RegisterUserDTO?] {
        const { email, name, password } = object;
        if (!regularExps.email.test(email))     return ["Email is not valid"];
        if (!name)      return ["Missing name"];
        if (!password)  return ["Missing password"];
        
        return [undefined, new RegisterUserDTO(email, name, password)];
    }
}