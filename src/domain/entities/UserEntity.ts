import { CustomError } from "../errors/CustomError";

export class UserEntity {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly validatedEmail: boolean,
        public readonly password: string,
        public readonly role: string[],
        public readonly img?: string
    ) {}

    static fromObject( object: {[key: string]: any} ): UserEntity {

        const { id, _id, name, email, validatedEmail, password, role, img } = object;
        if( !id && !_id ) 
            throw CustomError.badRequest("UserEntity.fromObject: id or _id is required");
        
        if( !name )
            throw CustomError.badRequest("Missing name");

        if( !email )
            throw CustomError.badRequest("Missing email");

        if( !password )
            throw CustomError.badRequest("Missing password");

        if( !role )
            throw CustomError.badRequest("Missing role");

        if( validatedEmail === undefined )
            throw CustomError.badRequest("Missing validatedEmail");

        return new UserEntity(
            id || _id,
            name,
            email,
            validatedEmail,
            password,
            role,
            img
        );
    }
}
