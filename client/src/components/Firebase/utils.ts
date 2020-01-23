import Event from '../../model/event';
import EventClass from '../../model/event-class';
import Participant from '../../model/participant';
import Club from '../../model/club';

export const eventConverter = {
    toFirestore(event: Event): firebase.firestore.DocumentData {
        return {
            name: event.name,
            eventType: event.eventType,
            description: event.description,
            startTime: event.startTime,
            registrationStart: event.registrationStart,
            registrationEnd: event.registrationEnd,
            eventClasses: event.eventClasses,
            participants: event.participants
        }
    },
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions): Event {
        const data = snapshot.data();
        return new Event(
            snapshot.id,
            data.name,
            data.eventType,
            data.description,
            data.startTime,
            data.registrationStart,
            data.registrationEnd,
            data.eventClasses.map((d: any) => (new EventClass(d.name, d.course, d.description))),
            data.participants.map((d: any) => (new Participant(d.firstName, d.lastName, d.club, d.eventClass))));
    }
};

export const clubConverter = {
    toFirestore(club: Club): firebase.firestore.DocumentData {
        return {name: club.name, shortName: club.shortName};
    },
    fromFirestore(
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions): Club {
        const data = snapshot.data(options)!;
        return new Club(data.name, data.shortName);
    }
};