import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';

export class AuthRoutes {

  static get routes(): Router {

    const router = Router();

    const authService     = new AuthService();
    const authController  = new AuthController(authService);

    // Definir las rutas
    router.post('/login', authController.login );
    router.post('/register', authController.register );
    router.get('/validate-email/:token', authController.validateEmail );

    return router;
  }
}