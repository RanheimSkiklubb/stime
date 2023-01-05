import { FC, useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useHistory } from "react-router-dom";
import moment from 'moment';
import Event from '../../model/event';
import Firebase from '../Firebase';
import {CheckCircle} from "@mui/icons-material";
import {useAuthState} from "react-firebase-hooks/auth";
import {getAuth} from "firebase/auth";
import HeaderBar from "../headerbar/HeaderBar";
import { Theme } from "@mui/material/styles";
import {makeStyles} from '@mui/styles';
import {orderBy} from 'lodash';

const useStyles = makeStyles((theme: Theme) => ({
        root: {
            flexGrow: 1,
        },
        narrowCell: {
            width: '10%',
        },
        icon: {
            color: 'green',
        },
    }));

const EventListPage: FC = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const [admin, setAdmin] = useState<boolean>(false);
    const [user] = useAuthState(getAuth());
    const [events, setEvents] = useState<Event[]>([]);

    const sortAndStore = (events:Event[]) => {
        setEvents(orderBy(events, ['startTime'], ['desc']));
    }

    useEffect(() => {
        return Firebase.subscribeEvents(sortAndStore);
    }, []);

    useEffect(() => {
        const fetchClaims = async () => {
            const idTokenResult =  await user?.getIdTokenResult(true);
            const admin: boolean = idTokenResult ? idTokenResult.claims.admin as unknown as boolean : false;
            setAdmin(admin === true);
        };
        if (user) fetchClaims();
    }, [user, setAdmin])

    const eventLink = (event: Event): string => {
        return admin ? `/admin/${event.id}` : `/event/${event.id}`

    };

    return (
        <>
            <HeaderBar heading="Arrangement" />
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align='center' className={classes.narrowCell}>Påmelding åpen</TableCell>
                            <TableCell>Dato</TableCell>
                            <TableCell>Arrangement</TableCell>
                            <TableCell>Øvelse</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {events.map((event:Event) => (
                        <TableRow hover key={event.name} onClick={() => history.push(eventLink(event))}>
                            <TableCell align='center'>{event.registrationOpen() ? <CheckCircle className={classes.icon} /> : <div></div>}</TableCell>
                            <TableCell>{moment(event.startTime).format("DD. MMM YYYY")}</TableCell>
                            <TableCell>{event.name}</TableCell>
                            <TableCell>{event.eventType}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </>
    );
};

export default EventListPage;
