import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import makeStyles from '@mui/styles/makeStyles';
import Event from '../../model/event';
import EventClass from '../../model/event-class';
import moment from 'moment';
import RegistrationInfo from './RegistrationInfo';
import {sortBy} from 'lodash';

interface Props {
    event: Event
}

const EventInfo = (props: Props) => {

    const useStyles = makeStyles({
        infoTable: {
            '& td': {
                verticalAlign: "top"
            },
            '& ul': {
                margin: "0",
                padding: "0 0 0 16px"
            }
        },
        noMargin:  {
            marginTop: "0",
        }
    });
    const classes = useStyles();
    const description = {__html: props.event.description}
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TableContainer component={Paper}>
                        <Table className={classes.infoTable}>
                            <TableBody>
                                <TableRow><TableCell>Arrangement:</TableCell><TableCell>{props.event.name}</TableCell></TableRow>
                                <TableRow><TableCell>Dato:</TableCell><TableCell>{moment(props.event.startTime).format("DD. MMM YYYY")}</TableCell></TableRow>
                                <TableRow><TableCell>Øvelse:</TableCell><TableCell>{props.event.eventType}</TableCell></TableRow>
                                <TableRow><TableCell>Første start:</TableCell><TableCell>{moment(props.event.startTime).format("HH:mm")}</TableCell></TableRow>
                                <TableRow><TableCell>Arrangementsinfo:</TableCell><TableCell><span className={classes.noMargin} dangerouslySetInnerHTML={description}/></TableCell></TableRow>
                                <RegistrationInfo event={props.event} />
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Klasse</TableCell>
                                    <TableCell>Løype</TableCell>
                                    <TableCell>Beskrivelse</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    sortBy(props.event.eventClasses, 'order')
                                    .map((ec:EventClass, idx:number) => (
                                        <TableRow key={ec.name}>
                                            <TableCell>{ec.name}</TableCell>
                                            <TableCell>{ec.course}</TableCell>
                                            <TableCell>{ec.description}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </>
    )
}

export default EventInfo;
