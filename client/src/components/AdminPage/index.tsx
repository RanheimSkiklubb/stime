import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Event from '../../model/event';
import { useNavigate, useParams, useLocation, Link, Routes, Route, Navigate } from "react-router-dom";
import ParticipantEdit from '../ParticipantEdit';
import EventClassEdit from '../EventClassEdit';
import StartGroupEdit from '../StartGroupEdit';
import Firebase from '../Firebase';
import {useAuthState} from "react-firebase-hooks/auth";
import {getAuth} from "firebase/auth";
import HeaderBar from "../headerbar/HeaderBar";
import EventInfo from './EventInfo';
import NewEvent from './NewEvent';

const AdminPage = () => {

    const { eventId: eventIdFromUrl } = useParams<{ eventId: string }>();
    const [admin, setAdmin] = useState<boolean>(false);
    const [user] = useAuthState(getAuth());
    const [event, setEvent] = useState<Event>(Event.newEvent());
    const [eventId, setEventId] = useState(eventIdFromUrl);
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const url = eventIdFromUrl ? `/admin/${eventIdFromUrl}` : '/admin';

    useEffect(() => {
        const fetchClaims = async () => {
            const idTokenResult = await user?.getIdTokenResult();
            const admin: boolean = idTokenResult ? idTokenResult.claims.admin as unknown as boolean : false;
            setAdmin(admin === true);
        };
        if (user) fetchClaims();
    }, [user, setAdmin])

    const saveEvent = async (name: string, eventType: string, description: string,
        startTime: Date, registrationStart: Date, registrationEnd: Date, registrationEndInfo: string) => {
        if (eventId) {
            await Firebase.updateEvent(eventId, name, eventType, description, startTime, registrationStart, registrationEnd, registrationEndInfo);
            alert("Arrangmentet ble lagret");
        }
        else {
            const doc = await Firebase.addEvent(name, eventType, description, startTime, registrationStart, registrationEnd, registrationEndInfo);
            setEventId(doc.id);
            setRedirect(true);
        }
    };

    useEffect(() => {
        if (eventIdFromUrl) {
            setEventId(eventIdFromUrl);
            return Firebase.subscribeEvent(eventIdFromUrl, setEvent);
        }
    }, [eventIdFromUrl]);

    if (admin) {
        if (redirect) {
            const url = `/admin/${eventId}`;
            return (<Navigate to={url} replace />);
        }
        let eventEditPane;

        if (eventId && event.id.length === 0) {
            eventEditPane = (<></>); //Don't render edit pane until event loaded
        }
        else if (eventId) {
            eventEditPane = <EventInfo event={event} saveEventCallback={saveEvent}/>
        }
        else {
            eventEditPane = <NewEvent />
        }
        return (
            <>
                <HeaderBar heading={eventId ? "Event Admin" : "New Event"}/>

                <AppBar position="static" sx={{ mb: 1 }}>
                    <Tabs indicatorColor="primary" textColor="inherit" value={location.pathname || url} aria-label="simple tabs example">
                        <Tab label="Arrangement" component={ Link } value={`${url}`} to={`${url}`}/>
                        <Tab label={`Puljer (${event.startGroups.length})`}  component={ Link } value={`${url}/groups`} to={`${url}/groups`}/>
                        <Tab label={`Klasser (${event.eventClasses.length})`} component={ Link } value={`${url}/classes`} to={`${url}/classes`}/>
                        <Tab label={`Deltakere (${event.participants.length})`} component={ Link } value={`${url}/list`} to={`${url}/list`}/>
                    </Tabs>
                </AppBar>
                <Routes>
                    <Route index element={eventEditPane} />
                    <Route path="groups" element={<StartGroupEdit eventId={event.id} startGroups={event.startGroups} startTime={event.startTime} startListPublished={event.startListPublished}/>} />
                    <Route path="classes" element={<EventClassEdit event={event}/>} />
                    <Route path="list" element={<ParticipantEdit event={event}/>} />
                </Routes>
            </>
        );
    }
    return (
        <>
            <HeaderBar heading="Admin" />

            <Box sx={{ mt: 4, fontWeight: 'bold' }}>You need to be an administrator to see this page</Box>
            <div><Button variant="text" color="primary" onClick={() => navigate(`/event/${event.id}`)}>Go to event page</Button></div>
        </>
    )

}

export default AdminPage;
