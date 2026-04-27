import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Participant from '../../model/participant';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface Props {
    participant: Participant,
    registerMoreCallback: () => void
}

const Confirmation = (props: Props) => {
    return (
        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontWeight: 'bold' }}>Din påmelding er registrert</p>
            <TableContainer>
                <Table size="small">
                    <TableBody>
                        <TableRow>
                            <TableCell>Startnummer</TableCell>
                            <TableCell>{props.participant.startNumber}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Starttid</TableCell>
                            <TableCell>{props.participant.startTime}</TableCell>
                        </TableRow>
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
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ m: 2 }}>
                <Button variant="contained" color="primary" onClick={props.registerMoreCallback}>Meld på flere</Button>
            </Box>
        </Stack>
    );
}

export default Confirmation;
