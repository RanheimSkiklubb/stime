import React from 'react';
import Event from '../../model/event';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import EventClass from '../../model/event-class';


interface Props {
    event: Event;
}

const StartNumberTab: React.FC<Props> = (props: Props) => {

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Klasse</TableCell>
                        <TableCell>Intervall</TableCell>
                        <TableCell>Ant. reservenummer</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.event.eventClasses.map((ec:EventClass, idx:number) => 
                    <TableRow key={idx}>
                        <TableCell>{`${ec.name} (${ec.course})`}</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </TableContainer>
    );
    
}

export default StartNumberTab;