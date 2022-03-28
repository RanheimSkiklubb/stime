import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Event from '../../model/event';
import { useHistory, useParams, useRouteMatch, Link, Switch, Route, Redirect } from "react-router-dom";
import ParticipantEdit from '../ParticipantEdit';
import EventClassEdit from '../EventClassEdit';
import StartGroupEdit from '../StartGroupEdit';
import Firebase from '../Firebase';
import {useAuthState} from "react-firebase-hooks/auth";
import {getAuth} from "firebase/auth";
import HeaderBar from "../headerbar/HeaderBar";
import {makeStyles} from "@mui/styles";
import EventInfo from './EventInfo';
import NewEvent from './NewEvent';

interface MatchParams {
    eventId: string
}

interface Props {
    pathname: string
}

const useStyles = makeStyles((theme) =>({
        root: {
            flexGrow: 1,
        },
        appBar: {
            marginBottom: theme.spacing(1),
        },
        info: {
            marginTop: 32,
            fontWeight: "bold",
        }
    }));


const AdminPage: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const eventIdFromUrl = useParams<MatchParams>().eventId;
    const [admin, setAdmin] = useState<boolean>(false);
    const [user] = useAuthState(getAuth());
    const [event, setEvent] = useState<Event>(Event.newEvent());
    const [eventId, setEventId] = useState(eventIdFromUrl);
    const [baseEventSelected, setBaseEventSelected] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const history = useHistory();
    const { path, url } = useRouteMatch();

    useEffect(() => {
        const fetchClaims = async () => {
            const idTokenResult = await user?.getIdTokenResult();
            const admin: boolean = idTokenResult ? idTokenResult.claims.admin as unknown as boolean : false;
            setAdmin(admin === true);
        };
        if (user) fetchClaims();
    }, [user, setAdmin])

    const setBaseEvent = (e: Event) => {
        setEvent(e);
        setBaseEventSelected(true);
    }

    const saveEvent = async (name: string, eventType: string, description: string,
        startTime: Date, registrationStart: Date, registrationEnd: Date, registrationEndInfo: string) => {
        if (eventId) {
            await Firebase.updateEvent(eventId, name, eventType, description, startTime, registrationStart, registrationEnd, registrationEndInfo);
            alert("Arrangmentet ble lagret");
        }
        else {
            const doc = await Firebase.addEvent(event)
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
            return (<Redirect to={url}/>);
        }
        let eventEditPane;

        if (eventId && event.id.length === 0) {
            eventEditPane = (<></>); //Don't render edit pane until event loaded
        }
        else if (baseEventSelected || eventId) {
            eventEditPane = <EventInfo event={event} saveEventCallback={saveEvent}/>
        }
        else {
            eventEditPane = <NewEvent baseEventCallback={setBaseEvent}/>
        }
        return (
            <React.Fragment>
                <HeaderBar heading={eventId ? "Event Admin" : "New Event"}/>

                <AppBar position="static" className={classes.appBar}>
                    <Tabs indicatorColor="primary" textColor="inherit" value={props.pathname || url} aria-label="simple tabs example">
                        <Tab label="Arrangement" component={ Link } value={`${url}`} to={`${url}`}/>
                        <Tab label={`Puljer (${event.startGroups.length})`}  component={ Link } value={`${url}/groups`} to={`${url}/groups`}/>
                        <Tab label={`Klasser (${event.eventClasses.length})`} component={ Link } value={`${url}/classes`} to={`${url}/classes`}/>
                        <Tab label={`Deltakere (${event.participants.length})`} component={ Link } value={`${url}/list`} to={`${url}/list`}/>
                    </Tabs>
                </AppBar>
                <Switch>
                    <Route exact path={`${path}`}>{eventEditPane}</Route>
                    <Route path={`${path}/groups`}><StartGroupEdit eventId={event.id} startGroups={event.startGroups} startTime={event.startTime} startListPublished={event.startListPublished}/></Route>
                    <Route path={`${path}/classes`}><EventClassEdit event={event}/></Route>
                    <Route path={`${path}/list`}><ParticipantEdit event={event}/></Route>
                </Switch>
            </React.Fragment>
        );
    }
    return (
        <React.Fragment>
            <HeaderBar heading="Admin" />

            <div className={classes.info}>You need to be an administrator to see this page</div>
            <div><Button variant="text" color="primary" onClick={() => history.push(`/event/${event.id}`)}>Go to event page</Button></div>
        </React.Fragment>
    )

}

export default AdminPage;
