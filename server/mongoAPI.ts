import { Db } from 'mongodb';
import Event from './api/event';
import { Participant } from './api/participant';


export default class MongoAPI {
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    getEvent(id: string): Promise<Event | null> {
        return this.db.collection("event").findOne({id})
            .then(event => event ? new Event(event.id, event.name, new Date(event.startTime), event.participants) : null)
    }

    getAllEvents(): Promise<Event[]> {
        return this.db.collection("event").find().toArray()
            .then(events => events.map(event => new Event(event.id, event.name, new Date(event.startTime), event.participants)));
    }
    
    saveParticipant(eventId: string, participant: Participant) {
        const safeCopy = {firstName: participant.firstName, lastName: participant.lastName, club: participant.club, birthYear: participant.birthYear};
        return this.db.collection("event").updateOne({id: eventId}, {$push: {participants: safeCopy}});
    }

}

