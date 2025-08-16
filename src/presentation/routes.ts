import { Router } from 'express';
import { AuthRoutes } from './auth/auth.routes';
import { CategoryRoutes } from './category/category.routes';
import { ProductRoutes } from './product/product.routes';
import { FilesRoutes } from './file-upload/files.routes';

export class AppRoutes {
  static get routes(): Router {

    const router = Router();

    // Definir las rutas
    router.use('/api/auth', AuthRoutes.routes );
    router.use('/api/categories', CategoryRoutes.routes);
    router.use('/api/products', ProductRoutes.routes);
    router.use('/api/upload', FilesRoutes.routes);

    return router;
  }
}