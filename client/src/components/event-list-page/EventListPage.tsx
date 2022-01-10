import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useHistory } from "react-router-dom";
import moment from 'moment';
import Event from '../../model/event';
import Firebase from '../Firebase';
import {CheckCircle} from "@material-ui/icons";
import {useAuthState} from "react-firebase-hooks/auth";
import firebase from "firebase";
import HeaderBar from "../headerbar/HeaderBar";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/styles";
import {orderBy} from 'lodash';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        narrowCell: {
            width: '10%',
        },
        icon: {
            color: 'green',
        },
    })
);

const EventListPage: React.FC = (props) => {
    const classes = useStyles({});
    const history = useHistory();
    const [admin, setAdmin] = useState<boolean>(false);
    const [user] = useAuthState(firebase.auth());
    const [events, setEvents] = useState<Event[]>([]);

    const sortAndStore = (events:Event[]) => {
        setEvents(orderBy(events, ['startTime'], ['desc']));
    }

    useEffect(() => {
        return Firebase.subscribeEvents(sortAndStore);
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
            <HeaderBar heading="Arrangement" />
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align='center' className={classes.narrowCell}>Påmelding åpen</TableCell>
                            <TableCell>Dato</TableCell>
                            <TableCell>Arrangement</TableCell>
                            <TableCell>Øvelse</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {events.map((event:Event) => (
                        <TableRow hover key={event.name} onClick={() => history.push(eventLink(event))}>
                            <TableCell align='center'>{event.registrationOpen() ? <CheckCircle className={classes.icon} /> : <div></div>}</TableCell>
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