import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { useHistory } from "react-router-dom";
import moment from 'moment';
import Event from '../model/event';


const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
});

const EventListPage: React.FC = () => {
    
    const history = useHistory();
    const [events, setEvents] = useState<Event[]>([]);
    const classes = useStyles();

    useEffect(() => {
        const fecthEvents = () => {
            fetch('http://localhost:3001/api/event')
            .then(res => res.json())
            .then((data) => setEvents(data))
        }
        fecthEvents();
    }, []);

    return (
        <React.Fragment>
            <h1 style={{textAlign: "center"}}>Arrangement</h1><br/>

            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Dato</TableCell>
                            <TableCell>Arrangment</TableCell>
                            <TableCell>Øvelse</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {events.map((event:Event) => (
                        <TableRow hover key={event.name} onClick={() => history.push(`/event/${event.id}`)}>
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

}

export default EventListPage;