import Participant from './participant';
import EventClass from './event-class';
import moment from 'moment';
// import Club from "./club";

export default class Event {
    constructor(readonly id: string,
                readonly name: string,
                readonly eventType: string,
                readonly description: string,
                readonly startTime: Date,
                readonly registrationStart: Date,
                readonly registrationEnd: Date,
                readonly eventClasses: EventClass[],
                readonly participants: Participant[]) {}

    registrationStarted(): boolean {
        return moment().isAfter(this.registrationStart);
    }

    registrationEnded(): boolean {
        return moment().isAfter(this.registrationEnd);
    }

    registrationOpen():boolean {
        return moment().isBetween(this.registrationStart, this.registrationEnd);
    };


}

// export const eventConverter = {
//     toFireStore(event: Event): firebase.firestore.DocumentData {
//
//     },
//     fromFirestore(
//         snapshot: firebase.firestore.QueryDocumentSnapshot,
//         options: firebase.firestore.SnapshotOptions): Event {
//
//     }
// };

// export const eventsFromFirebase = (querySnapshot: firebase.firestore.QuerySnapshot) : Event[] => {
//     const events: Event[] = [];
//     querySnapshot.forEach(doc => { events.push(eventFromFirebase(doc)) });
//     return events;
// };
//
// export const eventFromFirebase = (document: firebase.firestore.QueryDocumentSnapshot | firebase.firestore.DocumentSnapshot): Event => {
//     const data: any = document.data();
//     return new Event(
//         document.id,
//         data.name,
//         data.eventType,
//         data.description,
//         data.startTime,
//         data.registrationStart,
//         data.registrationEnd,
//         eventClassesFromFirebase(data.eventClasses),
//         participantsFromFirebase(data.participants)
//     );
// };
//
// const eventClassesFromFirebase = (fbClasses: object[]): EventClass[] => {
//     const eventClasses: EventClass[] = [];
//     fbClasses.forEach(fbClass => { eventClasses.push(eventClassFromFirebase(fbClass)) });
//     return eventClasses;
// };
//
// const eventClassFromFirebase = (fbClass: any): EventClass => {
//     const eventClass: EventClass = {
//         name:  fbClass.name,
//         course: fbClass.course,
//         description: fbClass.description
//     };
//     return eventClass;
// };
//
// export const participantsFromFirebase = (fbParticipants: object[]): Participant[] => {
//     const participants: Participant[] = [];
//     fbParticipants.forEach(fbParticipant => { participants.push(participantFromFirebase(fbParticipant)) });
//     return participants;
// };
//
// const participantFromFirebase = (fbParticipant: any): Participant => {
//     const participant: Participant = {
//         firstName: fbParticipant.firstName,
//         lastName: fbParticipant.lastName,
//         club: fbParticipant.club,
//         eventClass: fbParticipant.eventClass
//     };
//     return participant;
// };

// export const clubsFromFirebase = (fbClubs: firebase.firestore.QuerySnapshot): Club[] => {
//     const clubs: Club[] = [];
//     fbClubs.forEach(fbClub => { clubs.push(clubFromFirebase(fbClub))});
//     return clubs;
// };
//
// const clubFromFirebase = (fbClub: firebase.firestore.QueryDocumentSnapshot): Club => {
//     const data: any = fbClub.data();
//     const club: Club = {
//         name: data.name,
//         shortName: data.shortName
//     }
//     return club;
// };
