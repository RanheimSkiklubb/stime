import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import { SxProps, Theme } from '@mui/material/styles';
import Participant from '../../model/participant';

interface Props {
    participant: Participant,
    email: string,
    phone: string,
    sx?: SxProps<Theme>
}

const RegisteredParticipant = (props: Props) => {
    return (
        <TableContainer>
            <Table size="small" sx={props.sx}>
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
                    <TableRow>
                        <TableCell>Telefon</TableCell>
                        <TableCell>{props.phone}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default RegisteredParticipant;