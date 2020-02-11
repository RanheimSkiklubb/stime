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

import RegistrationInfo from './RegistrationInfo';
import ParticipantList from './ParticipantList';
import Firebase from '../Firebase';
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Login from "../login/Login";

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

    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        const eventId = props.match.params.eventId;
        return Firebase.subscribeEvent(eventId, setEvent);
    }, [props.match]);

    const useStyles = makeStyles({
        infoTable: {
            '& td': {
                verticalAlign: "top"
            },
            '& ul': {
                margin: "0",
                padding: "0 0 0 16px"
            }
        },
      });

    const classes = useStyles();
    const description = {__html: event.description}
    const infoTab = (
        <React.Fragment>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TableContainer component={Paper}>
                        <Table className={classes.infoTable}>
                            <TableBody>
                                <TableRow><TableCell>Arrangement:</TableCell><TableCell>{event.name}</TableCell></TableRow>
                                <TableRow><TableCell>Dato:</TableCell><TableCell>{moment(event.startTime).format("DD. MMM YYYY")}</TableCell></TableRow>
                                <TableRow><TableCell>Øvelse:</TableCell><TableCell>{event.eventType}</TableCell></TableRow>
                                <TableRow><TableCell>Første start:</TableCell><TableCell>{moment(event.startTime).format("HH:mm")}</TableCell></TableRow>
                                <TableRow><TableCell>Arrangementsinfo:</TableCell><TableCell><span style={{marginTop: "0"}} dangerouslySetInnerHTML={description}/></TableCell></TableRow>
                                <RegistrationInfo event={event} />
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
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h4" style={{flexGrow: 1}}>
                        {event.name}
                    </Typography>
                    <Login />
                </Toolbar>
            </AppBar>
            <AppBar position="static">
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Informasjon"/>
                    <Tab label={event.startListPublished ? "Startliste" : `Deltakerliste (${event.participants.length})`}/>
                </Tabs>
            </AppBar>
            <TabPanel value={tabIndex} index={0}>
                {infoTab}
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <ParticipantList event={event}/>
            </TabPanel>
        </React.Fragment>
    );
    
}

export default EventPage;