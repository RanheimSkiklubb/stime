import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';

import Event from '../../model/event';
import EventClass from '../../model/event-class';
import { match } from "react-router-dom";
import moment from 'moment';

import Registration from '../registration/Registration';
import ParticipantList from './ParticipantList';
import StartNumberTab from './StartNumberTab';
import Club from '../../model/club';
import Firebase from '../Firebase';

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

const EventPage: React.FC<Props> = (props: Props) => {

    const [event, setEvent] = useState<Event>(new Event("", "", "", "", new Date(), new Date(), new Date(), [], []));
    const [clubs, setClubs] = useState<Club[]>([]);
    const [tabIndex, setTabIndex] = useState(0);

    // const loadEvent = async () => {
    //     const eventId = props.match.params.eventId;
    //     //const event: Event = await firebase.fetchEvent(eventId);
    //     //setEvent(event);
    // };

    useEffect(() => {
        const eventId = props.match.params.eventId;
        return Firebase.subscribeEvent(eventId, setEvent);
    }, [props.match]);

    useEffect(() => {
        return Firebase.subscribeClubs(setClubs);
    }, []);

    const useStyles = makeStyles({
        infoTable: {
          '& td': {
              verticalAlign: "top"
          }
        },
      });

    const registrationInfo = () => {
        if (!event.registrationStarted()) {
            return (<>Påmeldingen har ikke åpnet</>);
        }
        if (event.registrationEnded()) {
            return (<>Påmeldingsfristen er ute. Etteranmelding kan gjøres til paamelding@ranheimskiklubb.no</>);
        }
        return (<><Registration event={event} clubs={clubs} />
            <p style={{marginBottom: '0'}}>Frist: {moment(event.registrationEnd).format("D. MMM YYYY, HH:mm")}</p></>);
    }
    const classes = useStyles();
    const infoTab = (
        <React.Fragment>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TableContainer component={Paper}>
                        <Table className={classes.infoTable}>
                            <TableBody>
                                <TableRow><TableCell>Dato:</TableCell><TableCell>{moment(event.startTime).format("DD. MMM YYYY")}</TableCell></TableRow>
                                <TableRow><TableCell>Arrangement:</TableCell><TableCell>{event.description}</TableCell></TableRow>
                                <TableRow><TableCell>Øvelse:</TableCell><TableCell>{event.eventType}</TableCell></TableRow>
                                <TableRow><TableCell>Første start:</TableCell><TableCell>{moment(event.startTime).format("HH:mm")}</TableCell></TableRow>
                                <TableRow><TableCell>Arrangementsinfo:</TableCell><TableCell>{event.description}</TableCell></TableRow>
                                <TableRow>
                                    <TableCell>Påmelding:</TableCell>
                                    <TableCell>
                                        {registrationInfo()}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Klasse</TableCell>
                                    <TableCell>Løype</TableCell>
                                    <TableCell>Beskrivelse</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {event.eventClasses.map((ec:EventClass, idx:number) => (
                                    <TableRow key={ec.name}>
                                        <TableCell>{ec.name}</TableCell>
                                        <TableCell>{ec.course}</TableCell>
                                        <TableCell>{ec.description}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </React.Fragment>
    );

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <React.Fragment>
            <h2>{event.name}</h2>
            <AppBar position="static">
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Informasjon"/>
                    <Tab label={`Deltakerliste (${event.participants.length})`}/>
                    <Tab label="Admin: startnummer"/>
                </Tabs>
            </AppBar>
            <TabPanel value={tabIndex} index={0}>
                {infoTab}
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <ParticipantList event={event}/>
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                <StartNumberTab eventClasses={event.eventClasses}/>
            </TabPanel>
        </React.Fragment>
    );
    
}

export default EventPage;