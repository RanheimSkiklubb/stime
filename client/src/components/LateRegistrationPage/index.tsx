import {useEffect, useState} from 'react';
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import {useParams} from "react-router-dom";
import Event from '../../model/event';
import Firebase from '../Firebase';
import ParticipantList from '../ParticipantList';
import LateRegistration from '../LateRegistration';

const LateRegistrationPage = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const [event, setEvent] = useState<Event>(Event.newEvent());

    useEffect(() => {
        if (!eventId) return;
        return Firebase.subscribeEvent(eventId, setEvent);
    }, [eventId]);

    return (
        <>
            <AppBar position="sticky">
                <Typography variant="h5" sx={{ flexGrow: 1, p: 2 }}>Etteranmelding</Typography>
            </AppBar>
            {
                !event.startListPublished ? <p>Etteranmelding har ikke åpnet ennå</p> :
                <>
                    <LateRegistration event={event} sx={{ m: 2 }} caption="Meld på"/>
                    <ParticipantList event={event} />
                </>
            }
        </>
    )
}

export default LateRegistrationPage;
