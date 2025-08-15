import { Router } from 'express';
import { CategoryController } from './category.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryService } from '../services/category.service';

export class CategoryRoutes {
    static get routes(): Router {
        const router = Router();

        const categoryService = new CategoryService()
        const categoryController = new CategoryController(categoryService)

        // Definir las rutas
        router.get('/', categoryController.getCategories)
        router.post('/',    [ AuthMiddleware.validateToken ], categoryController.createCategory)

        return router;
    }
}