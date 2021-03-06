import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Event from '../../model/event';
import { useHistory, useParams, useRouteMatch, Link, Switch, Route } from "react-router-dom";
import ParticipantEdit from '../ParticipantEdit';
import EventClassEdit from '../EventClassEdit';
import StartGroupEdit from '../StartGroupEdit';
import Firebase from '../Firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import {useAuthState} from "react-firebase-hooks/auth";
import HeaderBar from "../headerbar/HeaderBar";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/styles";
import EventInfo from './EventInfo';
import NewEvent from './NewEvent';

interface MatchParams {
    eventId: string
}

interface Props {
    pathname: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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

    const [admin, setAdmin] = useState<boolean>(false);
    const [user] = useAuthState(firebase.auth());
    const [event, setEvent] = useState<Event>(new Event("", "", "", "", new Date(), new Date(), new Date(), "", false, false, [], [], []));
    const [eventId, setEventId] = useState(useParams<MatchParams>().eventId);
    const [baseEventSelected, setBaseEventSelected] = useState(false);

    const [redirect, setRedirect] = useState(false);
    const history = useHistory();
    const { path, url } = useRouteMatch();

    useEffect(() => {
        const fetchClaims = async () => {
            const idTokenResult =  await user?.getIdTokenResult(true);
            setAdmin(idTokenResult?.claims.admin);
        };
        if (user) fetchClaims();
    }, [user, setAdmin])

    const loadEvent = (e: Event) => {
        setEvent(e);
    }

    const setBaseEvent = (e: Event) => {
        setEvent(e);
        setBaseEventSelected(true);
    }

    const saveEvent = async (name: string, eventType: string, description: string,
        startTime: Date, registrationStart: Date, registrationEnd: Date, registrationEndInfo: string) => {
        event.name = name;
        event.eventType = eventType;
        event.description = description;
        event.startTime = startTime;
        event.registrationStart = registrationStart;
        event.registrationEnd = registrationEnd;
        event.registrationEndInfo = registrationEndInfo;
        if (eventId) {
            Firebase.updateEvent(eventId, event);
            alert("Arrangmentet ble lagret");
        }
        else {
            const doc = await Firebase.addEvent(event)
            setEventId(doc.id);
            setRedirect(true);
        }
    };

    useEffect(() => {
        if (eventId) {
            setEventId(eventId);
            return Firebase.subscribeEvent(eventId, loadEvent);
        }
    }, [eventId]);

    if (admin) {
        if (redirect) {
            const url = `/admin/${eventId}`;
            return (<Redirect to={url}/>);
        }
        return (
            <React.Fragment>
                <HeaderBar heading={eventId ? "Event Admin" : "New Event"}/>

                <AppBar position="static" className={classes.appBar}>
                    <Tabs value={props.pathname || url} aria-label="simple tabs example">
                        <Tab label="Arrangement" component={ Link } value={`${url}`} to={`${url}`}/>
                        <Tab label={`Puljer (${event.startGroups.length})`} component={ Link } value={`${url}/groups`} to={`${url}/groups`}/>
                        <Tab label={`Klasser (${event.eventClasses.length})`} component={ Link } value={`${url}/classes`} to={`${url}/classes`}/>
                        <Tab label={`Deltakere (${event.participants.length})`} component={ Link } value={`${url}/list`} to={`${url}/list`}/>
                    </Tabs>
                </AppBar>
                <Switch>
                    <Route exact path={`${path}`}>{baseEventSelected || eventId ? <EventInfo event={event} saveEventCallback={saveEvent}/> : <NewEvent baseEventCallback={setBaseEvent}/>}</Route>
                    <Route path={`${path}/groups`}><StartGroupEdit event={event}/></Route>
                    <Route path={`${path}/classes`}><EventClassEdit event={event}/></Route>
                    <Route path={`${path}/list`}><ParticipantEdit event={event}/></Route>´
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