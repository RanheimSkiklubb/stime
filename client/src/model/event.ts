import Participant from './participant';
import EventClass from './event-class';
import moment from 'moment';
// import Club from "./club";

export default class Event {
    hasStartList?: boolean;
    name: string;
    eventType: string;
    description: string;
    startTime: Date;
    registrationStart: Date;
    registrationEnd: Date;
    constructor(readonly id: string,
                name: string,
                eventType: string,
                description: string,
                startTime: Date,
                registrationStart: Date,
                registrationEnd: Date,
                readonly eventClasses: EventClass[],
                readonly participants: Participant[]) {
                    this.name = name;
                    this.eventType = eventType;
                    this.description = description;
                    this.startTime = startTime;
                    this.registrationStart = registrationStart;
                    this.registrationEnd = registrationEnd;
                }

    registrationStarted(): boolean {
        return moment().isAfter(this.registrationStart);
    }

    registrationEnded(): boolean {
        return moment().isAfter(this.registrationEnd);
    }

    registrationOpen():boolean {
        return moment().isBetween(this.registrationStart, this.registrationEnd);
    };

    eventEnded():boolean {
        return moment().isAfter(this.startTime);
    };
}