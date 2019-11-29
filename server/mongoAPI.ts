import { Db } from 'mongodb';
import Event from './event';


export default class MongoAPI {
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    getEvent(id: string): Promise<Event | null> {
            return this.db.collection("event").findOne({id})
                .then(event => event ? new Event(event.id, event.name, new Date(event.startTime), event.participants) : null)
    }

}

