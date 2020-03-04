import React, { useState } from 'react';

import Club from '../../model/club';
import Event from '../../model/event';
import Participant from '../../model/participant';
import Firebase from '../Firebase';
import ParticipantDetails from './ParticipantDetails';
import SelectClass from './SelectClass';
import Confirmation from './Confirmation';
import NoLongerAvailable from './NoLongerAvailable';
import moment from 'moment';

interface Props {
    event: Event;
    clubs: Club[];
    closeCallback: () => void;
    resetTimerCallback: () => void;
}

interface StartItem {
    startNumber: number;
    startTime: string;
}

enum Progress {
    SelectClass,
    ParticipantDetails,
    Confirmation,
    NoAvailableStartNumbers,
    StartNumberNoLongerAvailable
}

const RegistrationForm: React.FC<Props> = (props: Props) => {

    const [progress, setProgress] = useState<Progress>(Progress.SelectClass);
    const [eventClass, setEventClass] = useState("");
    const [startTime, setStartTime] = useState("");
    const [startNumber, setStartNumber] = useState(-1);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [club, setClub] = useState("");
    
    const findFirstAvailableStartItem = (eventClassName: string):StartItem|null => {
        const eventClass = props.event.eventClasses.find(ec => ec.name === eventClassName);
        if ((!eventClass) || (eventClass.firstStartNumber === undefined) || (eventClass.firstStartTime === undefined) || (!eventClass.lastStartNumber === undefined)) {
            throw new Error("Event class not found or event class missing start number/time info");
        }
        const firstStartNumber = eventClass.firstStartNumber || 0;
        const lastStartNumber = eventClass.lastStartNumber || 0;
        const findStartTime = (startNumber: number):string => 
            moment(eventClass.firstStartTime)
                .add(eventClass.startInterval * (startNumber - firstStartNumber), 's')
                .format("HH:mm:ss");
        
        let startNumbersForClass:number[] = props.event.participants
            .filter(p => p.eventClass === eventClassName)
            .map<number>(p => p.startNumber || 0)
            .sort((a, b) => a - b);

        let index = 0;        
        for (let i = eventClass.firstStartNumber; i <= lastStartNumber; i++) {
            if (startNumbersForClass[index] === undefined || startNumbersForClass[index] !== i) {
                return {startNumber: i, startTime: findStartTime(i)}
            }
            index += 1;
        }
        return null;
    }

    const handleNext = (eventClassName: string) => {
        setEventClass(eventClassName);
        const startItem = findFirstAvailableStartItem(eventClassName);
        if (!startItem) {
            setProgress(Progress.NoAvailableStartNumbers);
        }
        else {
            setStartTime(startItem.startTime);
            setStartNumber(startItem?.startNumber);
            setProgress(Progress.ParticipantDetails);
        }
    };

    const handleRestart = () => {
        setProgress(Progress.SelectClass);
    }

    const handleRegister = (participant: Participant) => {
        const verificationStartItem = findFirstAvailableStartItem(participant.eventClass);
        if (verificationStartItem?.startNumber !== participant.startNumber) {
            setProgress(Progress.StartNumberNoLongerAvailable);
            return;
        }
        setFirstName(participant.firstName);
        setLastName(participant.lastName);
        setClub(participant.club);
        try {
            (async () => {
                await Firebase.addParticipant(props.event.id, participant);
            })();
        }
        catch (error) {
            console.error(error);
        }
        setProgress(Progress.Confirmation);
    }

    const handleRegisterMore = () => {
        setFirstName("");
        setEventClass("");
        setStartTime("");
        setStartNumber(-1);
        setProgress(Progress.SelectClass);
    }

    if (progress === Progress.SelectClass) {
        props.resetTimerCallback();
        return (<SelectClass event={props.event} nextCallback={handleNext}/>)
    }
    if (progress === Progress.NoAvailableStartNumbers) {
        return (<p>Det er ingen ledige startnummer i klassen. Ta kontakt med sekretæriatet.</p>)
    }
    if (progress === Progress.ParticipantDetails) {
        return (<ParticipantDetails eventClass={eventClass} startNumber={startNumber} 
            startTime={startTime} clubs={props.clubs} lastName={lastName}
            club={club} registerCallback={handleRegister} event={props.event}/>);
    }
    if (progress === Progress.Confirmation) {
        return (
            <Confirmation participant={{firstName, lastName, club, startNumber, startTime, eventClass}} 
                registerMoreCallback={handleRegisterMore}/>
        )
    }
    if (progress === Progress.StartNumberNoLongerAvailable) {
        return (
            <NoLongerAvailable startNumber={startNumber} restartCallback={handleRestart}/>
        );
    }
    throw new Error("Illegal state");
}

export default RegistrationForm;