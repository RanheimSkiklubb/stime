export default class Event {
    id: string;
    name: string;
    startTime: Date;
    participants: string[];
    constructor(id: string, name: string, startTime: Date, participants: string[]) {
        this.id = id;
        this.name = name;
        this.startTime = startTime;
        this.participants = participants;
    }
}