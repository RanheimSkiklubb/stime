import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Event from '../../model/event';
import dayjs from 'dayjs';

import Registration from '../registration/Registration';


interface Props {
    event: Event,
}

const RegistrationInfo = (props: Props) => {
    if (!props.event.registrationStarted()) {
        return (
            <TableRow>
                <TableCell>Påmelding:</TableCell>
                <TableCell>Påmeldingen har ikke åpnet</TableCell>
            </TableRow>
        );
    }
    if (props.event.registrationEnded()) {
        if (props.event.eventEnded()) return null;
        const registrationEndInfo = {__html: props.event.registrationEndInfo}
        return (
            <TableRow>
                <TableCell>Påmelding:</TableCell>
                <TableCell><span style={{ marginTop: 0 }} dangerouslySetInnerHTML={registrationEndInfo}/></TableCell>
            </TableRow>
        );
    }
    return (
        <>
            <TableRow>
                <TableCell>Påmeldingsfrist:</TableCell>
                <TableCell>
                    <p style={{ marginTop: 0, marginBottom: 24 }}>{dayjs(props.event.registrationEnd).format("D. MMM YYYY, HH:mm")}</p>
                    <Registration event={props.event} />
                </TableCell>
            </TableRow>
        </>
    );
}

export default RegistrationInfo;
