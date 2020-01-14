import Participant from './participant';
import EventClass from './eventClass';

export default interface Event {
    id: string;
    name: string;
    eventType: string;
    description: string;
    startTime: Date;
    registrationStart: Date;
    registrationEnd: Date;
    eventClasses: EventClass[];
    participants: Participant[];
}