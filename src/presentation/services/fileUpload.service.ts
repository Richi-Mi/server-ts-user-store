import path from "path";
import fs from 'fs';
import crypto from 'crypto'

import { UploadedFile } from "express-fileupload";
import { CustomError } from "../../domain";

export class FileUploadService {
    constructor() {}

    private checkFolder(folderPath : string) {
        const exists = fs.existsSync(folderPath)
        if(!exists)
            fs.mkdirSync(folderPath)
    }
    public async uploadMultipleFiles(
        files: UploadedFile[], 
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpeg', 'jpg', 'gif']
    ) {
        try {
            const uploadedFiles = await Promise.all(files.map( f => this.uploadFile(f, folder, validExtensions) ))
            return uploadedFiles
        }
        catch(error) {
            throw error
        }

    }
    public async uploadFile( 
        file: UploadedFile, 
        folder: string = 'uploads',
        validExtensions : string[] = ['png', 'jpeg', 'jpg', 'gif']
     ) {
        try {
            
            const fileExtension = file.mimetype.split('/').at(1)
            
            if( !validExtensions.includes(fileExtension!) ) {                
                throw CustomError.badRequest('Invalid extension')
            }
            const destination = path.resolve( __dirname, '../../../', folder)

            const fileName = `/${crypto.randomUUID()}.${fileExtension}`

            this.checkFolder(destination)

            file.mv(destination + fileName, (err) => {
                if (err) 
                    throw err;
            });            

            return fileName
        
        }
        catch(error) {            
            throw error
        }
    }
}