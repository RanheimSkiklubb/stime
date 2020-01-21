import Event from '../../model/event';
import EventClass from '../../model/event-class';
import Participant from '../../model/participant';
import Club from '../../model/club';

export const eventsFromFirebase = (querySnapshot: firebase.firestore.QuerySnapshot) : Event[] => {
    const events: Event[] = [];
    querySnapshot.forEach(doc => { events.push(eventFromFirebase(doc)) });
    return events;
};

export const eventFromFirebase = (document: firebase.firestore.QueryDocumentSnapshot | firebase.firestore.DocumentSnapshot): Event => {
    const data: any = document.data();
    const event: Event = {
        id: document.id,
        name: data.name,
        eventType: data.eventType,
        description: data.description,
        startTime: data.startTime,
        registrationStart: data.registrationStart,
        registrationEnd: data.registrationEnd,
        eventClasses: eventClassesFromFirebase(data.eventClasses),
        participants: participantsFromFirebase(data.participants)
        };
    return event;
};

const eventClassesFromFirebase = (fbClasses: object[]): EventClass[] => {
    const eventClasses: EventClass[] = [];
    fbClasses.forEach(fbClass => { eventClasses.push(eventClassFromFirebase(fbClass)) });
    return eventClasses;
};

const eventClassFromFirebase = (fbClass: any): EventClass => {
    const eventClass: EventClass = {
        name:  fbClass.name,
        course: fbClass.course,
        description: fbClass.description
    };
    return eventClass;
};

export const participantsFromFirebase = (fbParticipants: object[]): Participant[] => {
    const participants: Participant[] = [];
    fbParticipants.forEach(fbParticipant => { participants.push(participantFromFirebase(fbParticipant)) });
    return participants;
};

const participantFromFirebase = (fbParticipant: any): Participant => {
    const participant: Participant = {
        id: fbParticipant.id,
        firstName: fbParticipant.firstName,
        lastName: fbParticipant.lastName,
        club: fbParticipant.club,
        eventClass: fbParticipant.eventClass
    };
    return participant;
};

export const clubsFromFirebase = (fbClubs: firebase.firestore.QuerySnapshot): Club[] => {
    const clubs: Club[] = [];
    fbClubs.forEach(fbClub => { clubs.push(clubFromFirebase(fbClub))});
    return clubs;
};

const clubFromFirebase = (fbClub: firebase.firestore.QueryDocumentSnapshot): Club => {
    const data: any = fbClub.data();
    const club: Club = {
        name: data.name,
        shortName: data.shortName
    }
    return club;
};
