import {App} from './app';
import logger from './logger';
import { MongoClient, Db } from 'mongodb';

const dbUrl = 'mongodb://stime:stime@localhost:27017/stime';
const port = 3001;

async function run() {
    let db;
    try {
        db = await connectToDb(dbUrl);
    } catch(error) {
        logger.error(`Could not connect to ${dbUrl}. Error: ${error}`);
        return;
    }
    const expressApp = new App(db).expressServer;
    expressApp.listen(port, () => logger.info(`Library server is running on ${port}`));
}

async function connectToDb(url: string): Promise<Db> {
    return MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(mongoClient => {
            logger.info("Connected to " + url);
            return mongoClient.db("stime");
        })
}

run();