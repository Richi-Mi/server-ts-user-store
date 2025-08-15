import { SendMailOptions } from "nodemailer";
import { bcryptAdapter, envs, TokenAdapter } from "../../config";
import { User } from "../../data";
import { CustomError, LoginUserDTO, RegisterUserDTO, UserEntity } from "../../domain";
import { EmailService } from "./email.service";

export class AuthService {
    constructor(
        private readonly emailService : EmailService
    ) {}

    public validateEmail = async (token : string) => {
        const payload = await TokenAdapter.validateToken(token);        
        if( !payload )
            throw CustomError.unauthorized('Invalid token');

        const { email } = payload as { email: string };
        if( !email )
            throw CustomError.internalServerError('Email not in token');

        const user = await User.findOne({ email })

        if(!user)
            throw CustomError.badRequest('User not found');

        user.validatedEmail = true
        await user.save()
    }

    public async registerUser(registerUserDTO: RegisterUserDTO) {
        // Call the repository or any other service to register the user
        const existsUser = await User.findOne({ email: registerUserDTO.email })
        if(existsUser)
            throw CustomError.badRequest('User already exists')

        try {
            const user = new User(registerUserDTO)
            user.password = bcryptAdapter.hash(registerUserDTO.password);
            
            await user.save()

            await this.sendEmailValidationLink(user.email)

            const { password, ...userEntity } = UserEntity.fromObject(user)

            const token = await TokenAdapter.generateToken({ id: user.id })

            return {
                user: { ...userEntity },
                token
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
    private sendEmailValidationLink = async (email : string) => {
        const token = await TokenAdapter.generateToken({ email });
        if( !token )
            throw CustomError.internalServerError('Error getting token');

        const link = `${envs.WEBSERVICE_HOST}/auth/validate-email/${token}`;
        const html = `
            <h1> Validate your email </h1>
            <hr>
            <p> Click on the following link to validate your email </p>
            <a href="${link}">Validate your email </a>
            `
        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html
        }
        const isSent = await this.emailService.sendEmail(options)
        if( !isSent )
            throw CustomError.internalServerError('Error sending email')

        return true
    }
}