import { Db } from 'mongodb';
import Event from './domain/event';
import Config from './domain/config';
import Participant from './domain/participant';
import logger from './logger';


export default class MongoAPI {
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    static eventFromObject = (o:any):Event => {
        return {
            id: o.id, 
            name: o.name, 
            startTime: new Date(o.startTime), 
            registrationStart: new Date(o.registrationStart), 
            registrationEnd: new Date(o.registrationEnd),
            eventClasses: o.eventClasses, 
            participants: o.participants
        }
    };

    getEvent(id: string): Promise<Event | null> {
        return this.db.collection("event").findOne({id})
            .then(obj => obj ? MongoAPI.eventFromObject(obj) : null)
    }

    getAllEvents(): Promise<Event[]> {
        return this.db.collection("event").find().toArray()
            .then(objs => objs.map(o => MongoAPI.eventFromObject(o)));
    }

    getConfig(): Promise<Config> {
        return this.db.collection("config").findOne({_id: 1})
            .then(obj => {
                if (!obj) {
                    const errorMessage = "Db does not contain config object!";
                    logger.error(errorMessage);
                    throw new Error(errorMessage);
                }
                return {clubs: obj.clubs}
            });
    }
    
    saveParticipant(eventId: string, participant: Participant) {
        const safeCopy = {firstName: participant.firstName, lastName: participant.lastName, club: participant.club, eventClass: participant.eventClass};
        return this.db.collection("event").updateOne({id: eventId}, {$push: {participants: safeCopy}});
    }

}

