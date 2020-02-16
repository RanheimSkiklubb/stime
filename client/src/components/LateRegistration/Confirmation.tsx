import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Participant from '../../model/participant';
import Grid from '@material-ui/core/Grid';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {createStyles} from "@material-ui/styles";

interface Props {
    participant: Participant,
}

const Confirmation: React.FC<Props> = (props: Props) => {

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            emphasize: {
                fontWeight: 'bold',
            },
        }
    ));
    const classes = useStyles({});

    return (
        <Grid container direction="column" justify="center" alignItems="center">
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
        </Grid>
        
    );
}

export default Confirmation;