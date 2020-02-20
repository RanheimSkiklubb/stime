import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import _ from 'lodash';
import Event from "../../model/event";
import EventClass from "../../model/event-class";
import Participant from '../../model/participant';
import Club from "../../model/club";

interface FirebaseConfig {
    apiKey?: String;
    authDomain?: String;
    databaseURL?: String;
    projectId?: String;
    storageBucket?: String;
    messagingSenderId?: String;
}

export const config: FirebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STOREAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

let db: firebase.firestore.Firestore;
let auth: firebase.auth.Auth;
let eventsRef: firebase.firestore.CollectionReference;
let clubsRef: firebase.firestore.CollectionReference;
let contactRef: firebase.firestore.CollectionReference;

const init = () => {
    firebase.initializeApp(config);
    db = firebase.firestore();
    auth = firebase.auth();
    eventsRef = db.collection('events').withConverter(eventConverter);
    clubsRef = db.collection('clubs').withConverter(clubConverter);
    contactRef = db.collection('contact-info');
};

const login = async () => {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(googleAuthProvider);
};

const logout = async () => {
    await auth.signOut();
};

const subscribeEvents = (callback: any) => {
    return eventsRef.onSnapshot(querySnapshot => {
        const events = _.sortBy(querySnapshot.docs.map(d => d.data()), 'startTime');
        callback(events);
    });
};

const subscribeEvent = (eventId: string, callback: any) => {
    return eventsRef.doc(eventId).onSnapshot(documentSnapshot => {
        const event = documentSnapshot.data();
        callback(event);
    });
};

const subscribeClubs = (callback: any) => {
    return clubsRef.onSnapshot(querySnapshot => {
        const clubs = querySnapshot.docs.map(d => d.data());
        const sortedClubs = _.sortBy(clubs, 'name');
        callback(sortedClubs);
    });
};

const fetchEvents = async () => {
    try {
        const collection = await eventsRef.get();
        return collection;
    } catch (error) {
        return Promise.reject(error);
    }
};

const fetchEvent = async (eventId: string) => {
    const eventBody = await eventsRef.doc(eventId).get();
    return eventBody.data();
};

const addParticipant = async (eventId: string, participant: Participant) => {
    await eventsRef.doc(eventId).update({
        participants: firebase.firestore.FieldValue.arrayUnion(participant)
    });
};

const updateEventClasses = async (eventId: string, eventClasses: EventClass[]) => {
    await eventsRef.doc(eventId).update({
        eventClasses: eventClasses.map(mapEventClassToFirestore)
    });
};

const updateParticipants = async (eventId: string, participants: Participant[]) => {
    await eventsRef.doc(eventId).update({
        participants: participants.map(mapParticipant)
    });
};

const updateEvent = async (eventId: string, event: Event) => {
    await eventsRef.doc(eventId).update({
        name: event.name,
        eventType: event.eventType,
        description: event.description,
        startTime: event.startTime, //firebase.firestore.Timestamp.fromDate(event.startTime),
        registrationStart: event.registrationStart, //firebase.firestore.Timestamp.fromDate(event.registrationStart),
        registrationEnd: event.registrationEnd, //firebase.firestore.Timestamp.fromDate(event.registrationEnd),
        eventClasses: event.eventClasses,
        participants: event.participants
    });
};

const addEvent = async (event: Event) => {
    await eventsRef.add({
        name: event.name,
        eventType: event.eventType,
        description: event.description,
        startTime: event.startTime, // firebase.firestore.Timestamp.fromDate(event.startTime),
        registrationStart: event.registrationStart, // firebase.firestore.Timestamp.fromDate(event.registrationStart),
        registrationEnd: event.registrationEnd, // firebase.firestore.Timestamp.fromDate(event.registrationEnd),
        eventClasses: event.eventClasses,
        participants: event.participants
    });
};

const setStartListGenerated = async (eventId: string) => {
    await eventsRef.doc(eventId).update({
        startListGenerated: true
    });
};

const setStartListPublished = async (eventId: string) => {
    await eventsRef.doc(eventId).update({
        startListPublished: true
    });
};

const addContact = async (eventId: string, contact: any) => {
    try {
        await contactRef.doc(eventId).update({
            contacts: firebase.firestore.FieldValue.arrayUnion(contact)
        });
    } catch (error) {
        console.error(error);
        await contactRef.doc(eventId).set({
            contacts: firebase.firestore.FieldValue.arrayUnion(contact)
        });
    }
};

const mapParticipant = (d: any) => {
    const p: Participant = { 
        firstName: !_.isNil(d.firstName) ? d.firstName : "", 
        lastName: !_.isNil(d.lastName) ? d.lastName : "",
        club: !_.isNil(d.club) ? d.club : "",
        eventClass: !_.isNil(d.eventClass) ? d.eventClass : ""
    };
    if (!_.isNil(d.startTime)) {
        p.startTime = d.startTime;
    }
    if (!_.isNil(d.startNumber)) {
        p.startNumber = d.startNumber;
    }
    return p;
}

const mapEventClassToFirestore = (eventClass: EventClass) => {
    const obj:any = {
        name: eventClass.name, 
        course: eventClass.course, 
        description: eventClass.description,
        order: eventClass.order,
        startInterval: eventClass.startInterval,
        reserveNumbers: eventClass.reserveNumbers
    };
    if (eventClass.firstStartNumber !== undefined) {
        obj.firstStartNumber = eventClass.firstStartNumber;
    } 
    if (eventClass.firstStartTime !== undefined) {
        obj.firstStartTime = firebase.firestore.Timestamp.fromDate(eventClass.firstStartTime);
    } 
    if (eventClass.lastStartNumber !== undefined) {
        obj.lastStartNumber = eventClass.lastStartNumber;
    } 
     return eventClass;
}

const mapEventClassFromFirestore = (d: any) => {
    const eventClass: EventClass = {
        name: d.name, 
        course: d.course, 
        description: d.description,
        order: d.order,
        startInterval: d.startInterval,
        reserveNumbers: d.reserveNumbers
    };
    if (d.firstStartNumber !== undefined) {
        eventClass.firstStartNumber = d.firstStartNumber;
    } 
    if (d.firstStartTime !== undefined) {
        eventClass.firstStartTime = d.firstStartTime.toDate();
    } 
    if (d.lastStartNumber !== undefined) {
        eventClass.lastStartNumber = d.lastStartNumber;
    } 
     return eventClass;
}

const eventConverter = {
    toFirestore(event: Event): firebase.firestore.DocumentData {
        console.log("for Jørn");
        return {
            name: event.name,
            eventType: event.eventType,
            description: event.description,
            startTime: firebase.firestore.Timestamp.fromDate(event.startTime),
            registrationStart: firebase.firestore.Timestamp.fromDate(event.registrationStart),
            registrationEnd: firebase.firestore.Timestamp.fromDate(event.registrationEnd),
            eventClasses: event.eventClasses,
            participants: event.participants,
            startListGenerated: event.startListGenerated,
            startListPublished: event.startListPublished
        };
    },
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions): Event {
        const data = snapshot.data();
        const event = new Event(
            snapshot.id,
            data.name,
            data.eventType,
            data.description,
            data.startTime.toDate(),
            data.registrationStart.toDate(),
            data.registrationEnd.toDate(),
            data.eventClasses.map(mapEventClassFromFirestore),
            data.participants.map(mapParticipant));
        if (data.startListGenerated !== undefined) {
            event.startListGenerated = data.startListGenerated;
        }
        if (data.startListPublished !== undefined) {
            event.startListPublished = data.startListPublished;
        }
        return event;
    }
};

const clubConverter = {
    toFirestore(club: Club): firebase.firestore.DocumentData {
        return { name: club.name, shortName: club.shortName };
    },
    fromFirestore(
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions): Club {
        const data = snapshot.data(options)!;
        return new Club(data.name, data.shortName);
    }
};

export default {
    init,
    login,
    logout,
    subscribeEvents,
    subscribeEvent,
    subscribeClubs,
    fetchEvents,
    fetchEvent,
    addParticipant,
    addContact,
    updateEventClasses,
    updateParticipants,
    setStartListGenerated,
    setStartListPublished,
    updateEvent,
    addEvent
}