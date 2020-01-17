import React from 'react';
import './EventPage.css';
import Event from '../model/event';
import Participant from '../model/participant';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';

interface Props {
    event: Event;
}

const ParticipantList: React.FC<Props> = (props: Props) => {

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Navn</TableCell>
                        <TableCell>Klubb</TableCell>
                        <TableCell>Klasse</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                    props.event.participants.map((p:Participant, idx:number) => 
                    <TableRow key={idx}>
                        <TableCell>{p.firstName + " " + p.lastName}</TableCell>
                        <TableCell>{p.club}</TableCell>
                        <TableCell>{p.eventClass}</TableCell>
                    </TableRow>)
                    }
                </TableBody>
            </Table>
        </TableContainer>
    ); 
}

export default ParticipantList;