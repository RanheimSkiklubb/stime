import { MongoClient, ObjectID, Db } from 'mongodb';
import logger from './logger';
import Event from './event';

const url = process.env.DB_URL || 'mongodb://stime:stime@localhost:27017/stime';

export default class MongoAPI {
    private static instance: MongoAPI;
    db: Db;

    private constructor(db: Db) {
        this.db = db;
    }

    getEvent(id: string): Promise<Event | null> {
            return this.db.collection("event").findOne({id})
                .then(event => event ? new Event(event.id, event.name, new Date(event.startTime), event.participants) : null)
    }

    static connect(): Promise<Db> {
        return MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(mongoClient => mongoClient.db("stime"))
    }

    static getInstance(): Promise<MongoAPI> {
        if (!MongoAPI.instance) {
            return MongoAPI.connect()
                .then(db => {
                    logger.info("Connected to " + url);
                    MongoAPI.instance = new MongoAPI(db);
                    return MongoAPI.instance;
                })
                .catch(error => {
                    logger.error(`Could not connect to ${url}. Error: ${error}`);
                    process.exit();
                    throw new Error("Dummy statement to make TypeScript compiler happy. Code will never reach this point");
                })
        }
        return Promise.resolve(MongoAPI.instance);
      }

}

