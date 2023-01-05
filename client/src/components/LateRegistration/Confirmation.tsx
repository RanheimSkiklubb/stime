import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Participant from '../../model/participant';
import Grid from '@mui/material/Grid';
import {Theme} from '@mui/material/styles';
import {makeStyles} from "@mui/styles";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface Props {
    participant: Participant,
    registerMoreCallback: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
            emphasize: {
                fontWeight: 'bold',
            },
        }
    ));

const Confirmation = (props: Props) => {

    const classes = useStyles();

    return (
        <Grid container direction="column" justifyContent="center" alignItems="center">
            <Grid item xs={12}>
                <p className={classes.emphasize}>Din påmelding er registrert</p>
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
                <Box m={2}>
                    <Button variant="contained" color="primary" onClick={props.registerMoreCallback}>Meld på flere</Button>
                </Box>
            </Grid>
        </Grid>
    );
}

export default Confirmation;
