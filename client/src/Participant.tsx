export default class Participant {
    id: string;
    firstName: string;
    lastName: string;
    club: string;
    eventClass: string;

    constructor(id: string, firstName: string, lastName: string, club: string, eventClass: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.club = club;
        this.eventClass = eventClass;
    }

    static fromObject(object: any): Participant {
        return new Participant(object.id, object.firstName, object.lastName, object.club, object.eventClass);
    }
}