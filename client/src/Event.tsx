import Participant from './Participant';

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

    static fromObject(obj: any) {
        return new Event(obj.id, obj.name, obj.startTime, obj.participants.map((item:any) => Participant.fromObject(item)))
    }
}