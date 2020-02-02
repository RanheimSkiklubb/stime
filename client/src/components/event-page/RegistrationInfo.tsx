import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Event from '../../model/event';
import Club from '../../model/club';
import moment from 'moment';

import Registration from '../registration/Registration';


interface Props {
    event: Event,
    clubs: Club[]
}

const RegistrationInfo: React.FC<Props> = (props: Props) => {
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
        return (
            <TableRow>
                <TableCell>Påmelding:</TableCell>
                <TableCell>Påmeldingsfristen er ute.<br/>Etteranmelding kan gjøres til <a href="mailto:paamelding@ranheimskiklubb.no">paamelding@ranheimskiklubb.no</a></TableCell>
            </TableRow>
        );
    }
    return (
        <>
            <TableRow>
                <TableCell>Påmeldingsfrist:</TableCell>
                <TableCell>
                    <p style={{marginTop: '0', marginBottom: '18px'}}>{moment(props.event.registrationEnd).format("D. MMM YYYY, HH:mm")}</p>
                    <Registration event={props.event} clubs={props.clubs} />
                </TableCell>
            </TableRow>
        </>
    );
}

export default RegistrationInfo;