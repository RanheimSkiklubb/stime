import Participant from './participant';
import EventClass from './event-class';
import moment from 'moment';
// import Club from "./club";

export default class Event {
    constructor(readonly id: string,
                readonly name: string,
                readonly eventType: string,
                readonly description: string,
                readonly startTime: Date,
                readonly registrationStart: Date,
                readonly registrationEnd: Date,
                readonly eventClasses: EventClass[],
                readonly participants: Participant[]) {}

    registrationStarted(): boolean {
        return moment().isAfter(this.registrationStart);
    }

    registrationEnded(): boolean {
        return moment().isAfter(this.registrationEnd);
    }

    registrationOpen():boolean {
        return moment().isBetween(this.registrationStart, this.registrationEnd);
    };
}