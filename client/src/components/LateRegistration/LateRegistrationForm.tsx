import React, { useState } from 'react';

import Club from '../../model/club';
import Event from '../../model/event';
import Participant from '../../model/participant';
import Firebase from '../Firebase';
import ParticipantDetails from './ParticipantDetails';
import SelectClass from './SelectClass';
import moment from 'moment';
import _ from 'lodash';

interface Props {
    event: Event,
    clubs: Club[],
    closeCallback: () => void;
}

interface StartItem {
    startNumber: number;
    startTime: string;
}

const RegistrationForm: React.FC<Props> = (props: Props) => {

    const [progress, setProgress] = useState(1);
    const [eventClass, setEventClass] = useState("");
    const [startTime, setStartTime] = useState("");
    const [startNumber, setStartNumber] = useState(-1);
    
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
        
        let startItemsForClass = props.event.participants
            .filter(p => p.eventClass === eventClassName)
            .map(p => ({startNumber: p.startNumber, startTime: p.startTime} as StartItem))
        startItemsForClass = _.sortBy(startItemsForClass, "startNumber");

        let index = 0;        
        for (let i = eventClass.firstStartNumber; i <= lastStartNumber; i++) {
            if (startItemsForClass[index] === undefined || startItemsForClass[index].startNumber !== i) {
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
            setProgress(2);
        }
        else {
            setStartTime(startItem.startTime);
            setStartNumber(startItem?.startNumber);
            setProgress(3);
        }
    };

    const handleRegister = (participant: Participant) => {
        try {
            (async () => {
                await Firebase.addParticipant(props.event.id, participant);
            })();
            alert("Deltaker påmeldt!");
        }
        catch (error) {
            console.error(error);
        }
        props.closeCallback();
    }

    if (progress === 1) {
        return (<SelectClass event={props.event} nextCallback={handleNext}/>)
    }
    if (progress === 2) {
        return (<p>Det er ingen ledige startnummer i klassen. Ta kontakt med sekretæriatet.</p>)
    }
    else {
        return (<ParticipantDetails eventClass={eventClass} startNumber={startNumber} 
            startTime={startTime} clubs={props.clubs} registerCallback={handleRegister}
            event={props.event}/>);
    }
}

export default RegistrationForm;