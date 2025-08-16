import { Router } from 'express';

import { FilesController } from './files.controller';
import { FileUploadService } from '../services/fileUpload.service';
import { FileUploadMiddleware } from '../middlewares/files.middleware';
import { CheckTypeMiddleware } from '../middlewares/type.middleware';

const validTypes = ['user', 'product', 'category']


export class FilesRoutes {

    static get routes(): Router {
        const router = Router();

        const fileUploadService = new FileUploadService()
        const filesController = new FilesController(fileUploadService);

        // router.use(FileUploadMiddleware.containFiles);

        // Definir las rutas
        router.post('/single/:type', [ 
            FileUploadMiddleware.containFiles, 
            CheckTypeMiddleware.checkTypes(validTypes)
        ], filesController.uploadFile);
        router.post('/multiple/:type', [ 
            FileUploadMiddleware.containFiles, 
            CheckTypeMiddleware.checkTypes(validTypes)
        ], filesController.uploadMultipleFiles);

        router.get('/:type/:img', filesController.getImage)

        return router;
    }

}