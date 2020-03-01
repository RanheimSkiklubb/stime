import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Event from '../../model/event';
import moment from 'moment';

import Registration from '../registration/Registration';
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/styles";


interface Props {
    event: Event,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        registrationDate: {
            marginTop: '0',
            marginBottom: theme.spacing(3),
        },
        noMargin:  {
            marginTop: "0",
        }
    })
);

const RegistrationInfo: React.FC<Props> = (props: Props) => {
    const classes = useStyles({});
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
                <TableCell><span className={classes.noMargin} dangerouslySetInnerHTML={registrationEndInfo}/></TableCell>
            </TableRow>
        );
    }
    return (
        <>
            <TableRow>
                <TableCell>Påmeldingsfrist:</TableCell>
                <TableCell>
                    <p className={classes.registrationDate}>{moment(props.event.registrationEnd).format("D. MMM YYYY, HH:mm")}</p>
                    <Registration event={props.event} />
                </TableCell>
            </TableRow>
        </>
    );
}

export default RegistrationInfo;