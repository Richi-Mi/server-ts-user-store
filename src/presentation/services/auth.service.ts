import { bcryptAdapter, TokenAdapter } from "../../config";
import { User } from "../../data";
import { CustomError, LoginUserDTO, RegisterUserDTO, UserEntity } from "../../domain";

export class AuthService {
    constructor() {}

    public async registerUser(registerUserDTO: RegisterUserDTO) {
        // Call the repository or any other service to register the user
        const existsUser = await User.findOne({ email: registerUserDTO.email })
        if(existsUser)
            throw CustomError.badRequest('User already exists')

        try {
            const user = new User(registerUserDTO)
            user.password = bcryptAdapter.hash(registerUserDTO.password);
            await user.save()

            const { password, ...userEntity } = UserEntity.fromObject(user)

            return {
                user: { ...userEntity },
                token: 'ABC'
            }
        }
        catch(error) {
            console.error(`Error registering user: ${error}`);
            throw CustomError.internalServerError('Error registering user');
        }
    }
    public async loginUser(loginUserDTO: LoginUserDTO) {
        try {
            const user = await User.findOne({
                email: loginUserDTO.email
            });

            if(!user)
                throw CustomError.badRequest('User not exists');

            const hasMatch = bcryptAdapter.compare(loginUserDTO.password, user.password);
            if(!hasMatch) 
                throw CustomError.badRequest('Password is invalid')

            const { password, ...userEntity } = UserEntity.fromObject(user)

            const token = await TokenAdapter.generateToken({ id: user.id })
            if(!token)
                throw CustomError.internalServerError('Error generating token');
            
            return {
                user: { ...userEntity },
                token
            }
        }
        catch(error) {
            console.error(`Error login user: ${error}`);
            throw CustomError.internalServerError('Error login user');
        }
    }
}