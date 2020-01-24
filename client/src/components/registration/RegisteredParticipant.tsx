import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Participant from '../../model/participant';

interface Props {
    participant: Participant,
    email: string,
    className?: string
}

const RegisteredParticipant: React.FC<Props> = (props: Props) => {
    return (
        <TableContainer>
            <Table size="small" className={props.className}>
                <TableBody>
                    <TableRow>
                        <TableCell>Fornavn</TableCell>
                        <TableCell>{props.participant.firstName}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Etternavn</TableCell>
                        <TableCell>{props.participant.lastName}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Klubb</TableCell>
                        <TableCell>{props.participant.club}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Klasse</TableCell>
                        <TableCell>{props.participant.eventClass}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>E-post</TableCell>
                        <TableCell>{props.email}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default RegisteredParticipant;