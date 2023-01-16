import Participant from './participant';
import EventClass from './event-class';
import StartGroup from './start-group';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

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
        return dayjs().isAfter(this.registrationStart);
    }

    registrationEnded(): boolean {
        return dayjs().isAfter(this.registrationEnd);
    }

    registrationOpen():boolean {
        return dayjs().isBetween(this.registrationStart, this.registrationEnd);
    };

    eventEnded():boolean {
        return dayjs().isAfter(this.startTime);
    };

    static newEvent(): Event {
        const date = dayjs().startOf('hour').add(1, 'hour').toDate();
        return new Event("", "", "", "", date, date, date, "", false, false, [], [], []);
    }
}