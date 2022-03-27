import Participant from './participant';
import EventClass from './event-class';
import StartGroup from './start-group';
import moment from 'moment';

export default class Event {
    name: string;
    eventType: string;
    description: string;
    startTime: Date;
    registrationStart: Date;
    registrationEnd: Date;
    registrationEndInfo: string;
    startListGenerated: boolean;
    startListPublished: boolean;
    constructor(readonly id: string,
                name: string,
                eventType: string,
                description: string,
                startTime: Date,
                registrationStart: Date,
                registrationEnd: Date,
                registrationEndInfo: string,
                startListGenerated: boolean,
                startListPublished: boolean,
                readonly startGroups: StartGroup[],
                readonly eventClasses: EventClass[],
                readonly participants: Participant[]) {
                    this.name = name;
                    this.eventType = eventType;
                    this.description = description;
                    this.startTime = startTime;
                    this.registrationStart = registrationStart;
                    this.registrationEnd = registrationEnd;
                    this.registrationEndInfo = registrationEndInfo;
                    this.startListGenerated = startListGenerated;
                    this.startListPublished = startListPublished;
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

    static newEvent(): Event {
        return new Event("", "", "", "", new Date(), new Date(), new Date(), "", false, false, [], [], []);
    }
}