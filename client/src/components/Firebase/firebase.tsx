import firebase from 'firebase/app';
import 'firebase/firestore';
import {eventFromFirebase, eventsFromFirebase, clubsFromFirebase} from "./utils";

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

export const init = () => { firebase.initializeApp(config) };

export const fetchEvents = async () => {
    try {
        const collection = await firebase.firestore().collection('events').get();
        return eventsFromFirebase(collection);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const fetchEvent = async (eventId: string) =>  {
    const eventBody = await firebase.firestore().collection('events').doc(eventId).get();
    return eventFromFirebase(eventBody);
};

export const fetchClubs = async () => {
    const collection = await firebase.firestore().collection('clubs').get();
    return clubsFromFirebase(collection);
};