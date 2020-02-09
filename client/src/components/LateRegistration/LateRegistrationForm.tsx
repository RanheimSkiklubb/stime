import React, { useState } from 'react';

import Club from '../../model/club';
import Event from '../../model/event';
import Participant from '../../model/participant';
import Firebase from '../Firebase';
import ParticipantDetails from './ParticipantDetails';
import SelectClass from './SelectClass';

interface Props {
    event: Event,
    clubs: Club[]
}

const RegistrationForm: React.FC<Props> = (props: Props) => {

    const [progress, setProgress] = useState(1);
    const [eventClass, setEventClass] = useState("");
    const [startTime, setStartTime] = useState("");
    const [startNumber, setStartNumber] = useState(-1);
    
    const handleNext = (eventClass: string) => {
        setEventClass(eventClass);
        setProgress(2);
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
    }

    if (progress === 1) {
        return (<SelectClass event={props.event} nextCallback={handleNext}/>)
    }
    else {
        return (<ParticipantDetails eventClass={eventClass} startNumber={startNumber} 
            startTime={startTime} clubs={props.clubs} registerCallback={handleRegister}
            event={props.event}/>);
    }
}

export default RegistrationForm;