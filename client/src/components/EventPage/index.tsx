import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Event from '../../model/event';
import { useParams, useRouteMatch, Link, Switch, Route } from "react-router-dom";
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

const EventPage: React.FC<Props> = (props: Props) => {

    const { eventId } = useParams<MatchParams>();
    const [event, setEvent] = useState<Event>(new Event("", "", "", "", new Date(), new Date(), new Date(), "", false, false, [], []));
    const { path, url } = useRouteMatch();

    useEffect(() => {
        return Firebase.subscribeEvent(eventId, setEvent);
    }, [eventId]);

    return (
        <React.Fragment>
            <HeaderBar heading={event.name}/>
            <AppBar position="static">
                <Tabs value={props.pathname} aria-label="simple tabs example">
                    <Tab label="Informasjon" component={ Link } value={`${url}/info`} to={`${url}/info`} />
                    <Tab label={event.startListPublished ? `Startliste (${event.participants.length})` : `Deltakerliste (${event.participants.length})`}
                        component={ Link } value={`${url}/list`} to={`${url}/list`} />
                </Tabs>
            </AppBar>
            <Switch>
                <Route path={`${path}/info`}>
                    <EventInfo event={event}/>
                </Route>
                <Route path={`${path}/list`}>
                    <ParticipantList event={event}/>
                </Route>
            </Switch>
        </React.Fragment>
    );
}

export default EventPage;