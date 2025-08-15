import { Request, Response } from "express";
import { CustomError, LoginUserDTO, RegisterUserDTO } from "../../domain";
import { AuthService } from "../services/auth.service";

export class AuthController {
    constructor(
        public readonly authService: AuthService
    ) {}

    private handdleError = (error: unknown, res: Response) => {
        if( error instanceof CustomError ) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    public login = (req: Request, res: Response) => {
        const  [error, loginUserDTO] = LoginUserDTO.create(req.body);
        if(error)
            return res.status(400).json({ error });

        this.authService.loginUser(loginUserDTO!)
            .then( user => res.status(200).json(user))
            .catch( err => this.handdleError(err, res));
    }

    public register = (req: Request, res: Response) => { 
        const [error, registerUserDTO] = RegisterUserDTO.create(req.body);

        if(error)
            return res.status(400).json({ error });        

        this.authService.registerUser(registerUserDTO!)
            .then( user => res.status(201).json(user))
            .catch( err => this.handdleError(err, res));
    }

    public validateEmail = (req: Request, res: Response) => {
        const { token } = req.params

        this.authService.validateEmail( token )
            .then( () => res.status(200).json('Email validated'))
            .catch( (error) => this.handdleError(error, res))        
    }
}