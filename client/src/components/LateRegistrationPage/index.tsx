import React, { useState, useEffect } from 'react';
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/styles";
import { match } from "react-router-dom";
import Event from '../../model/event';
import Firebase from '../Firebase';
import ParticipantList from '../ParticipantList';
import LateRegistration from '../LateRegistration';

interface MatchParams {
    eventId: string
}

interface Props {
    match: match<MatchParams>
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
    const classes = useStyles({});

    useEffect(() => {
        const eventId = props.match.params.eventId;
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