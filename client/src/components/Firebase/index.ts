import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore,
         onSnapshot,
         query,
         orderBy,
         collection,
         doc,
         getDocs,
         getDoc,
         updateDoc,
         addDoc,
         setDoc,
         arrayUnion,
         Timestamp,
         DocumentData,
         QueryDocumentSnapshot,
         SnapshotOptions
} from 'firebase/firestore';
import _ from 'lodash';
import Event from "../../model/event";
import EventClass from "../../model/event-class";
import StartGroup from "../../model/start-group";
import Participant from '../../model/participant';
import Club from "../../model/club";

interface FirebaseConfig {
    apiKey?: string;
    authDomain?: string;
    databaseURL?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
}

export const config: FirebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STOREAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

const firebaseApp = initializeApp(config);

const eventConverter = {
    toFirestore(event: Event): DocumentData {
        return {
            name: event.name,
            eventType: event.eventType,
            description: event.description,
            startTime: Timestamp.fromDate(event.startTime),
            registrationStart: Timestamp.fromDate(event.registrationStart),
            registrationEnd: Timestamp.fromDate(event.registrationEnd),
            registrationEndInfo: event.registrationEndInfo,
            startGroups: event.startGroups,
            eventClasses: event.eventClasses,
            participants: event.participants,
            startListGenerated: event.startListGenerated,
            startListPublished: event.startListPublished
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Event {
        const data = snapshot.data();
        const event = new Event(
            snapshot.id,
            data.name,
            data.eventType,
            data.description,
            data.startTime.toDate(),
            data.registrationStart.toDate(),
            data.registrationEnd.toDate(),
            data.registrationEndInfo,
            data.startListGenerated,
            data.startListPublished,
            data.startGroups ? data.startGroups.map(mapStartGroupFromFirestore) : [],
            data.eventClasses.map(mapEventClassFromFirestore),
            data.participants.map(mapParticipant)
        );
        return event;
    }
};

const clubConverter = {
    toFirestore(club: Club): DocumentData {
        return { name: club.name, shortName: club.shortName };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions): Club {
        const data = snapshot.data(options)!;
        return new Club(data.name, data.shortName);
    }
};



const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const eventsRef = collection(db, "events").withConverter(eventConverter);
const eventsQuery = query(eventsRef, orderBy('startTime', 'desc'));
const clubsRef = collection(db, "clubs").withConverter(clubConverter);
const contactRef = collection(db, "contact-info");

const eventRef = (eventId: string) => (
   doc(eventsRef, eventId).withConverter(eventConverter)
);

const login = async () => {
    const googleAuthProvider =  new GoogleAuthProvider();
    await signInWithPopup(auth, googleAuthProvider);
};

const logout = async () => {
    await signOut(auth);
};

const subscribeEvents = (callback: any) => {
    return onSnapshot(eventsQuery, querySnapshot => {
        const events = querySnapshot.docs.map(d => d.data());
        callback(events);
    });
};

const subscribeEvent = (eventId: string, callback: any) => {
    return onSnapshot(eventRef(eventId), documentSnapshot => {
        const event = documentSnapshot.data();
        callback(event);
    });
};

const subscribeClubs = (callback: any) => {
    return onSnapshot(query(clubsRef, orderBy('name')), querySnapshot => {
        const clubs = querySnapshot.docs.map(d => d.data());
        callback(clubs);
    });
};


const fetchEvent = async (eventId: string) => {
    const eventBody = await getDoc(eventRef(eventId));
    return eventBody.data();
};

const fetchEvents = async () => {
    const querySnapshot = await getDocs(eventsQuery);
    const data = querySnapshot.docs.map(event => event.data() as Event);
    return data;
};

const addParticipant = async (eventId: string, participant: Participant) => {
    await updateDoc(eventRef(eventId), 'participants', arrayUnion(participant));
};

const updateEventClasses = async (eventId: string, eventClasses: EventClass[]) => {
    await updateDoc(eventRef(eventId), 'eventClasses', eventClasses.map(mapEventClassToFirestore));
};

const updateStartGroups = async (eventId: string, startGroups: StartGroup[]) => {
    await updateDoc(eventRef(eventId), 'startGroups', startGroups.map(mapStartGroupToFirestore));
};

const updateParticipants = async (eventId: string, participants: Participant[]) => {
    await updateDoc(eventRef(eventId), 'participants', participants.map(mapParticipant));
};

const updateEvent = async (eventId: string, name: string, eventType: string, description: string, startTime: Date, registrationStart: Date, registrationEnd: Date, registrationEndInfo: string) => {
    await updateDoc(eventRef(eventId),
        'name', name,
        'eventType', eventType,
        'description', description,
        'startTime', startTime,
        'registrationStart', registrationStart,
        'registrationEnd', registrationEnd,
        'registrationEndInfo', registrationEndInfo);
};

const addEvent = async (name: string, eventType: string, description: string,
    startTime: Date, registrationStart: Date, registrationEnd: Date, registrationEndInfo: string) => {
    const doc = await addDoc(eventsRef, new Event("", name, eventType, description, startTime, registrationStart, 
        registrationEnd, registrationEndInfo, false, false, [], [], []));
    return await getDoc(doc);
};

const setStartListGenerated = async (eventId: string) => {
    await updateDoc(eventRef(eventId), 'startListGenerated', true);
};

const setStartListPublished = async (eventId: string) => {
    await updateDoc(eventRef(eventId), 'startListPublished', true);
};

const addContact = async (eventId: string, contact: any) => {
    try {
        await updateDoc(doc(contactRef, eventId), 'contacts', arrayUnion(contact));
    } catch (error) {
        console.error(error);
        await setDoc(doc(contactRef, eventId), {
            contacts: arrayUnion(contact)
        });
    }
};

const fetchContacts = async (eventId: string) => {
    try {
        const contacts = await getDoc(doc(contactRef, eventId));
        return contacts.data();
    } catch (error) {
        console.error("Error getting contacts: " + error);
        return Promise.reject(error);
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

const mapStartGroupToFirestore = (startGroup: StartGroup) => {
    const obj:any = {
        name: startGroup.name,
        firstStartTime: Timestamp.fromDate(startGroup.firstStartTime),
        separateNumberRange: startGroup.separateNumberRange
    };
    if (startGroup.firstNumber !== undefined) {
        obj.firstNumber = startGroup.firstNumber;
    }
    return obj;
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
    if (eventClass.startGroup !== undefined) {
        obj.startGroup = eventClass.startGroup;
    }
    if (eventClass.firstStartNumber !== undefined) {
        obj.firstStartNumber = eventClass.firstStartNumber;
    }
    if (eventClass.firstStartTime !== undefined) {
        obj.firstStartTime = Timestamp.fromDate(eventClass.firstStartTime);
    }
    if (eventClass.lastStartNumber !== undefined) {
        obj.lastStartNumber = eventClass.lastStartNumber;
    }
     return obj;
}

const mapStartGroupFromFirestore = (d: any) => {
    const startGroup: StartGroup = {
        name: d.name,
        firstStartTime: d.firstStartTime.toDate(),
        separateNumberRange: d.separateNumberRange
    };
    if (d.firstNumber !== undefined) {
        startGroup.firstNumber = d.firstNumber;
    }
     return startGroup;
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
    if (d.startGroup !== undefined) {
        eventClass.startGroup = d.startGroup;
    }
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

const exported = {
    //init,
    login,
    logout,
    subscribeEvents,
    subscribeEvent,
    subscribeClubs,
    fetchEvent,
    fetchEvents,
    addParticipant,
    addContact,
    fetchContacts,
    updateStartGroups,
    updateEventClasses,
    updateParticipants,
    setStartListGenerated,
    setStartListPublished,
    updateEvent,
    addEvent
};

export default exported;
