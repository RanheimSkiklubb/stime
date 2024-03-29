import {useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Event from '../../model/event';
import {Link, Route, Switch, useParams, useRouteMatch} from "react-router-dom";
import ParticipantList from '../ParticipantList';
import Firebase from '../Firebase';
import HeaderBar from '../headerbar/HeaderBar';
import EventInfo from './EventInfo';

interface MatchParams {
    eventId: string
}

interface Props {
    pathname: string
}

const EventPage = (props: Props) => {

    const { eventId } = useParams<MatchParams>();
    const [event, setEvent] = useState<Event>(Event.newEvent());
    const { path, url } = useRouteMatch();

    useEffect(() => {
        return Firebase.subscribeEvent(eventId, setEvent);
    }, [eventId]);

    return (
        <>
            <HeaderBar heading={event.name}/>
            <AppBar position="static">
                <Tabs indicatorColor="primary" textColor="inherit" value={props.pathname} aria-label="simple tabs example">
                    <Tab label="Informasjon" component={ Link } value={`${url}`} to={`${url}`}/>
                    <Tab label={event.startListPublished ? `Startliste (${event.participants.length})` : `Deltakerliste (${event.participants.length})`}
                         component={ Link } value={`${url}/list`} to={`${url}/list`} />
                </Tabs>
            </AppBar>
            <Switch>
                <Route exact path={`${path}`}>
                    <EventInfo event={event}/>
                </Route>
                <Route path={`${path}/list`}>
                    <ParticipantList event={event}/>
                </Route>
            </Switch>
        </>
    );
}

export default EventPage;
