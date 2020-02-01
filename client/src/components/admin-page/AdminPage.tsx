import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';

import Event from '../../model/event';
import { match } from "react-router-dom";
import moment from 'moment';

import RegistrationInfo from '../event-page/RegistrationInfo';
import ParticipantList from '../event-page/ParticipantList';
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

const AdminPage: React.FC<Props> = (props: Props) => {

    const [event, setEvent] = useState<Event>(new Event("", "", "", "", new Date(), new Date(), new Date(), [], []));
    const [clubs, setClubs] = useState<Club[]>([]);
    const [tabIndex, setTabIndex] = useState(0);

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
                                <RegistrationInfo event={event} clubs={clubs}/>
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
            <h2>Admin</h2>
            <AppBar position="static">
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Arrangement"/>
                    <Tab label="Klasser"/>
                    <Tab label={event.hasStartList ? "Startliste" : `Deltakere (${event.participants.length})`}/>
                </Tabs>
            </AppBar>
            <TabPanel value={tabIndex} index={0}>
                {infoTab}
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <StartNumberTab event={event}/>
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                <ParticipantList event={event}/>
            </TabPanel>
        </React.Fragment>
    );
    
}

export default AdminPage;