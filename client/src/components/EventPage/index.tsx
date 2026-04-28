import {useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Event from '../../model/event';
import {Link, Route, Routes, useParams, useLocation} from "react-router-dom";
import ParticipantList from '../ParticipantList';
import Firebase from '../Firebase';
import HeaderBar from '../headerbar/HeaderBar';
import EventInfo from './EventInfo';

const EventPage = () => {

    const { eventId } = useParams<{ eventId: string }>();
    const [event, setEvent] = useState<Event>(Event.newEvent());
    const location = useLocation();
    const url = `/event/${eventId}`;

    useEffect(() => {
        if (!eventId) return;
        return Firebase.subscribeEvent(eventId, setEvent);
    }, [eventId]);

    return (
        <>
            <HeaderBar heading={event.name}/>
            <AppBar position="static">
                <Tabs indicatorColor="primary" textColor="inherit" value={location.pathname} aria-label="simple tabs example">
                    <Tab label="Informasjon" component={ Link } value={`${url}`} to={`${url}`}/>
                    <Tab label={event.startListPublished ? `Startliste (${event.participants.length})` : `Deltakerliste (${event.participants.length})`}
                         component={ Link } value={`${url}/list`} to={`${url}/list`} />
                </Tabs>
            </AppBar>
            <Routes>
                <Route index element={<EventInfo event={event}/>} />
                <Route path="list" element={<ParticipantList event={event}/>} />
            </Routes>
        </>
    );
}

export default EventPage;
