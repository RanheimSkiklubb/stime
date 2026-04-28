import { FC, useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import Event from '../../model/event';
import Firebase from '../Firebase';
import {CheckCircle} from "@mui/icons-material";
import {useAuthState} from "react-firebase-hooks/auth";
import {getAuth} from "firebase/auth";
import HeaderBar from "../headerbar/HeaderBar";
import {orderBy} from 'lodash';

const EventListPage: FC = () => {
    const navigate = useNavigate();
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
                            <TableCell align='center' sx={{ width: '10%' }}>Påmelding åpen</TableCell>
                            <TableCell>Dato</TableCell>
                            <TableCell>Arrangement</TableCell>
                            <TableCell>Øvelse</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {events.map((event:Event) => (
                        <TableRow hover key={event.name} onClick={() => navigate(eventLink(event))}>
                            <TableCell align='center'>{event.registrationOpen() ? <CheckCircle sx={{ color: 'green' }} /> : <div></div>}</TableCell>
                            <TableCell>{dayjs(event.startTime).format("DD. MMM YYYY")}</TableCell>
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
