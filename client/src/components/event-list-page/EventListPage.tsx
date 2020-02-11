import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Login from '../login/Login';
import { useHistory } from "react-router-dom";
import moment from 'moment';
import Event from '../../model/event';
import Firebase from '../Firebase';
import {CheckCircle} from "@material-ui/icons";
import {useAuthState} from "react-firebase-hooks/auth";
import firebase from "firebase";

interface State {
    events: Event[]
}

const EventListPage: React.FC = (props) => {

    const history = useHistory();
    const [admin, setAdmin] = useState<boolean>(false);
    const [user] = useAuthState(firebase.auth());
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        return Firebase.subscribeEvents(setEvents);
    }, []);

    useEffect(() => {
        const fetchClaims = async () => {
            const idTokenResult =  await user?.getIdTokenResult(true);
            setAdmin(idTokenResult?.claims.admin);
        };
        if (user) fetchClaims();
    }, [user, setAdmin])

    const eventLink = (event: Event): string => {
        return admin ? `/admin/${event.id}` : `/event/${event.id}`

    };

    return (
        <React.Fragment>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h4" style={{flexGrow: 1}}>
                        Arrangement
                    </Typography>
                    <Login />
                </Toolbar>
            </AppBar>

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align='center' style={{width: '10%'}}>Påmelding åpen</TableCell>
                            <TableCell>Dato</TableCell>
                            <TableCell>Arrangement</TableCell>
                            <TableCell>Øvelse</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {events.map((event:Event) => (
                        <TableRow hover key={event.name} onClick={() => history.push(eventLink(event))}>
                            <TableCell align='center'>{event.registrationOpen() ? <CheckCircle style={{ color: 'green' }} /> : <div></div>}</TableCell>
                            <TableCell>{moment(event.startTime).format("DD. MMM YYYY")}</TableCell>
                            <TableCell>{event.name}</TableCell>
                            <TableCell>{event.eventType}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </React.Fragment>
    );
};

export default EventListPage;