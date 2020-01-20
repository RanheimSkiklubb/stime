import firebase from 'firebase/app';
import 'firebase/firestore';
import {eventFromFirebase, eventsFromFirebase, clubsFromFirebase, participantsFromFirebase} from "./utils";

interface FirebaseConfig {
    apiKey ?: String;
    authDomain ?: String;
    databaseURL ?: String;
    projectId ?: String;
    storageBucket ?: String;
    messagingSenderId ?: String;
}

const config: FirebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STOREAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

let db: firebase.firestore.Firestore;
let eventsRef: firebase.firestore.CollectionReference;
let clubsRef: firebase.firestore.CollectionReference;

export const init = () => {
    firebase.initializeApp(config);
    db = firebase.firestore();
    eventsRef = db.collection('events');
    clubsRef = db.collection('clubs');
};

export const subscribeEvents = (callback: any) => {
    eventsRef.onSnapshot(querySnapshot => {
        const events = eventsFromFirebase(querySnapshot);
        callback(events)
    });
};

export const subscribeEvent = (eventId: string, callback: any) => {
    eventsRef.doc(eventId).onSnapshot(documentSnapshot => {
        const event = eventFromFirebase(documentSnapshot);
        callback(event);
    });
};

export const subscribeClubs = (callback: any) => {
    clubsRef.onSnapshot(querySnapshot => {
        const clubs = clubsFromFirebase(querySnapshot);
        callback(clubs);
    });
};

export const fetchEvents = async () => {
    try {
        const collection = await eventsRef.get();
        return eventsFromFirebase(collection);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const fetchEvent = async (eventId: string) =>  {
    const eventBody = await eventsRef.doc(eventId).get();
    return eventFromFirebase(eventBody);
};

export const fetchClubs = async () => {
    const collection = await clubsRef.get();
    return clubsFromFirebase(collection);
};

export const addParticipant = async (eventId: string, participant: any) => {
    await eventsRef.doc(eventId).update({
        participants: firebase.firestore.FieldValue.arrayUnion(participant)
    });
};