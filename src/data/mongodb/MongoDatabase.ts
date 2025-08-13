import mongoose from "mongoose"

interface ConnectionOptions {
    mongoUri : string,
    dbName : string
}
export class MongoDatabase {
    static async connect(options: ConnectionOptions) {
        const { mongoUri, dbName } = options
        try {
            await mongoose.connect(mongoUri, {
                dbName
            })
            console.log('MongoDB Base de datos conectada');
            
            return true
        }   
        catch(err) {
            throw err
        }
    }
}