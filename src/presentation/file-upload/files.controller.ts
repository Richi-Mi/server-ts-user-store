import path from "path";
import fs from 'fs'

import { Request, Response } from "express";

import { CustomError } from "../../domain";
import { FileUploadService } from "../services/fileUpload.service";
import { UploadedFile } from "express-fileupload";


export class FilesController {
    

    constructor(
        private readonly fileUploadService : FileUploadService
    ) {}
    private handdleError = (error: unknown, res: Response) => {
        if( error instanceof CustomError ) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    public uploadFile = (req: Request, res: Response) => {
        const { type } = req.params

        const file = req.body.files[0] as UploadedFile
        this.fileUploadService.uploadFile( file, `uploads/${type}` )
            .then( uploaded => res.status(200).json({uploaded}))
            .catch(err => this.handdleError(err, res))
    }
    public uploadMultipleFiles = (req: Request, res: Response) => {
        const { type } = req.params

        const files = req.body.files as UploadedFile[]

        this.fileUploadService.uploadMultipleFiles( files, `uploads/${type}` )
            .then( uploaded => res.status(200).json({uploaded}))
            .catch(err => this.handdleError(err, res))
    }
    public getImage = (req: Request, res: Response) => {
        const { type, img } = req.params

        const imagePath = path.join(__dirname, '../../../uploads', type, img)

        if(!fs.existsSync(imagePath)) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.status(200).sendFile(imagePath);
    }

}