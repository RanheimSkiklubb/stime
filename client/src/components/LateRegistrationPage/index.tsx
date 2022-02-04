import React, { useState, useEffect } from 'react';
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material/styles";
import {makeStyles} from "@mui/styles";
import Event from '../../model/event';
import Firebase from '../Firebase';
import ParticipantList from '../ParticipantList';
import LateRegistration from '../LateRegistration';

interface Props {
    match: string
}

const useStyles = makeStyles((theme: Theme) => ({
        title: {
            flexGrow: 1,
            padding: theme.spacing(2)
        },
        button: {
            margin: theme.spacing(2)
        }
    })
);

const LateRegistrationPage: React.FC<Props> = (props: Props) => {
    const [event, setEvent] = useState<Event>(new Event("", "", "", "", new Date(), new Date(), new Date(), "", false, false, [], [], []));
    const classes = useStyles();

    useEffect(() => {
        const eventId = props.match;
        return Firebase.subscribeEvent(eventId, setEvent);
    }, [props.match]);

    return (
        <>
            <AppBar position="sticky">
                <Typography variant="h5" className={classes.title}>Etteranmelding</Typography>
            </AppBar>
            {
                !event.startListPublished ? <p>Etteranmelding har ikke åpnet ennå</p> :
                <>
                    <LateRegistration event={event} className={classes.button} caption="Meld på"/>
                    <ParticipantList event={event} />
                </>
            }
        </>
    )
}

export default LateRegistrationPage;
