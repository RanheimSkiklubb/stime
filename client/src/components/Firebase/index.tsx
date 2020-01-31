import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import _ from 'lodash';
import React from 'react';
import Event from "../../model/event";
import EventClass from "../../model/event-class";
import Participant from '../../model/participant';
import Club from "../../model/club";
import { useAuthState } from 'react-firebase-hooks/auth';

interface FirebaseConfig {
    apiKey ?: String;
    authDomain ?: String;
    databaseURL ?: String;
    projectId ?: String;
    storageBucket ?: String;
    messagingSenderId ?: String;
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

export const AdminLogin: React.FC = () => {
    const [user, initialising, error] = useAuthState(auth);
    if (initialising) {
        return (
            <div>
                <p>Initialising User...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div>
                <p>Error: {error}</p>
            </div>
        );
    }
    if (user) {
        return (
            <div>
                <p>Logged in as {user.displayName}</p>
                <button onClick={logout}>Log out</button>
            </div>
        );
    }
    return <button onClick={login}>Log in</button>;
};

const subscribeEvents = (callback: any) => {
    eventsRef.onSnapshot(querySnapshot => {
        const events = _.sortBy(querySnapshot.docs.map(d => d.data()), 'startTime');
        callback(events);
    });
};

const subscribeEvent = (eventId: string, callback: any) => {
    eventsRef.doc(eventId).onSnapshot(documentSnapshot => {
        const event = documentSnapshot.data();
        callback(event);
    });
};

const subscribeClubs = (callback: any) => {
    clubsRef.onSnapshot(querySnapshot => {
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

const fetchEvent = async (eventId: string) =>  {
    const eventBody = await eventsRef.doc(eventId).get();
    return eventBody.data();
};

const addParticipant = async (eventId: string, participant: Participant) => {
    await eventsRef.doc(eventId).update({
        participants: firebase.firestore.FieldValue.arrayUnion(Object.assign({}, participant)) //Object.assign converts to regular JS object which is required by Firebase
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

const eventConverter = {
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

const clubConverter = {
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
    addContact
}