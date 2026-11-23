import mongoose, {type Connection} from 'mongoose';

export async function connectMongo(uri:string): Promise<Connection> {
    return mongoose.createConnection(uri).asPromise();
}