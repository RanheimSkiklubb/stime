import Participant from './Participant';
import EventClass from './eventClass';

export default interface Event {
    id: string;
    name: string;
    startTime: Date;
    eventClasses: EventClass[];
    participants: Participant[];
}