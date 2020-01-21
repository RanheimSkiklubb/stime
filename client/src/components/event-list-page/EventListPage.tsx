import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CheckCircle from '@material-ui/icons/CheckCircle';

import { useHistory } from "react-router-dom";
import moment from 'moment';
import Event from '../../model/event';
import * as firebase from '../Firebase/firebase';

interface State {
    events: Event[]
}

const EventListPage: React.FC = (props) => {

    const history = useHistory();
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        firebase.subscribeEvents(setEvents);
    }, []);

    const registrationOpen = (event: Event):boolean => {
        const today = moment.now();
        return moment().isBetween(event.registrationStart, event.registrationEnd);
    };

    return (
        <React.Fragment>
            <h1>Arrangement</h1><br/>

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align='center' style={{width: '10%'}}>Påmelding åpen</TableCell>
                            <TableCell>Dato</TableCell>
                            <TableCell>Arrangment</TableCell>
                            <TableCell>Øvelse</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {events.map((event:Event) => (
                        <TableRow hover key={event.name} onClick={() => history.push(`/event/${event.id}`)}>
                            <TableCell align='center'>{registrationOpen(event) ? <CheckCircle style={{ color: 'green' }} /> : <div></div>}</TableCell>
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