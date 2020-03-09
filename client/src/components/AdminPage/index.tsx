import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';

import Event from '../../model/event';
import {match, useHistory} from "react-router-dom";

import ParticipantEdit from '../ParticipantEdit';
import EventClassEdit from '../EventClassEdit';
import Firebase from '../Firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import {useAuthState} from "react-firebase-hooks/auth";
import HeaderBar from "../headerbar/HeaderBar";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/styles";
import EventInfo from './EventInfo';

interface MatchParams {
    eventId: string
}

interface Props {
    match: match<MatchParams>
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index } = props;
  
    return (
        <div hidden={value !== index}>
            {value === index && <React.Fragment>{children}</React.Fragment>}
        </div>
    );
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
    const history = useHistory();

    const [admin, setAdmin] = useState<boolean>(false);
    const [user] = useAuthState(firebase.auth());
    const [event, setEvent] = useState<Event>(new Event("", "", "", "", new Date(), new Date(), new Date(), "", false, false, [], []));
    const [eventId, setEventId] = useState("");
    const [tabIndex, setTabIndex] = useState(0);

    const [redirect, setRedirect] = useState(false);

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
        const eventId = props.match.params.eventId;
        if (eventId) {
            setEventId(eventId);
            return Firebase.subscribeEvent(eventId, loadEvent);
        }
    }, [props.match]);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue);
    };

    if (admin) {
        if (redirect) {
            const url = `/admin/${eventId}`;
            return (<Redirect to={url}/>);
        }
        return (
            <React.Fragment>
                <HeaderBar heading={eventId ? "Edit Event" : "New Event"}/>

                <AppBar position="static" className={classes.appBar}>
                    <Tabs value={tabIndex} onChange={handleTabChange} aria-label="simple tabs example">
                        <Tab label="Arrangement"/>
                        <Tab label={`Klasser (${event.eventClasses.length})`}/>
                        <Tab label={`Deltakere (${event.participants.length})`}/>
                    </Tabs>
                </AppBar>
                <TabPanel value={tabIndex} index={0}>
                    <EventInfo event={event} saveEventCallback={saveEvent}/>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <EventClassEdit event={event}/>
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                    <ParticipantEdit event={event}/>
                </TabPanel>
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