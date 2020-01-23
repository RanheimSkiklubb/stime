import firebase from 'firebase/app';
import 'firebase/firestore';
import {eventConverter, clubConverter} from "./utils";
import Participant from '../../model/participant';
import _ from 'lodash';

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
let contactRef: firebase.firestore.CollectionReference;

export const init = () => {
    firebase.initializeApp(config);
    db = firebase.firestore();
    eventsRef = db.collection('events').withConverter(eventConverter);
    clubsRef = db.collection('clubs').withConverter(clubConverter);
    contactRef = db.collection('contact-info');
};

export const subscribeEvents = (callback: any) => {
    eventsRef.onSnapshot(querySnapshot => {
        const events = _.sortBy(querySnapshot.docs.map(d => d.data()), 'startTime');
        callback(events);
    });
};

export const subscribeEvent = (eventId: string, callback: any) => {
    eventsRef.doc(eventId).onSnapshot(documentSnapshot => {
        const event = documentSnapshot.data();
        callback(event);
    });
};

export const subscribeClubs = (callback: any) => {
    clubsRef.onSnapshot(querySnapshot => {
        const clubs = querySnapshot.docs.map(d => d.data());
        callback(clubs);
    });
};

export const fetchEvents = async () => {
    try {
        const collection = await eventsRef.get();
        return collection;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const fetchEvent = async (eventId: string) =>  {
    const eventBody = await eventsRef.doc(eventId).get();
    console.log(eventBody);
    return eventBody.data();
};

export const addParticipant = async (eventId: string, participant: Participant) => {
    await eventsRef.doc(eventId).update({
        participants: firebase.firestore.FieldValue.arrayUnion(participant)
    });
};

export const addContact = async (eventId: string, contact: any) => {
    try {
        await contactRef.doc(eventId).update({
            contacts: firebase.firestore.FieldValue.arrayUnion(contact)
        });
    } catch (error) {
        console.log(error);
        await contactRef.doc(eventId).set({
            contacts: firebase.firestore.FieldValue.arrayUnion(contact)
        });
    }
};