import Participant from './participant';

export default class Event {
    id: string;
    name: string;
    startTime: Date;
    participants: Participant[];
    constructor(id: string, name: string, startTime: Date, participants: Participant[]) {
        this.id = id;
        this.name = name;
        this.startTime = startTime;
        this.participants = participants;
    }
}