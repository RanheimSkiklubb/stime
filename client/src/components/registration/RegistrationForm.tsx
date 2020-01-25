import React, { useState } from 'react';
import Club from '../../model/club';
import Event from '../../model/event';
import Participant from '../../model/participant';
import Firebase from '../Firebase';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

interface Props {
    event: Event,
    clubs: Club[]
}

const RegistrationForm: React.FC<Props> = (props: Props) => {

    const [progress, setProgress] = useState(1);
    const [participant, setParticipant] = useState({firstName: "", lastName: "", club: "", eventClass: ""});
    const [email, setEmail] = useState("");

    const handleRegister = () => {
        try {
            const contact = {
                name: participant.firstName + " " + participant.lastName,
                email: email
            };
            (async () => {
                await Firebase.addParticipant(props.event.id, participant);
                await Firebase.addContact(props.event.id, contact);
            })();
            setProgress(3);
        }
        catch (error) {
            console.error(error);
        }
    }
    const handleRegisterMore = () => {
        setParticipant({firstName: '', lastName: participant.lastName, club: participant.club, eventClass: ''});
        setProgress(1);
    }
    const handleEdit = () => setProgress(1);
    const handleNext = (participant: Participant, email:string) => {
        setParticipant(participant);
        setEmail(email);
        setProgress(2);
    }

    if (progress === 1) {
        return <Step1 nextCallback={handleNext} participant={participant} email={email} event={props.event} clubs={props.clubs} />
    }
    if (progress === 2) {
        return <Step2 event={props.event} participant={participant} 
                    email={email} editCallback={handleEdit} registerCallback={handleRegister} />;
    }   
    return <Step3 registerMoreCallback={handleRegisterMore}/>;
}

export default RegistrationForm;