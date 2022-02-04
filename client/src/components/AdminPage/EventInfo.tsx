import React, { useState, ChangeEvent } from 'react';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Event from '../../model/event';
import moment from 'moment';
import { Theme } from "@mui/material/styles";
import {makeStyles} from "@mui/styles";

interface Props {
    event: Event;
    saveEventCallback: (name: string, eventType: string, description: string,
        startTime: Date, registrationStart: Date, registrationEnd: Date, registrationEndInfo: string) => void;
}

const useStyles = makeStyles((theme: Theme) =>
    ({
    root: {
        '&$disabled': {
            color: 'dimgray'
        }
    },
        disabled: {}
    }));

const EventInfo: React.FC<Props> = (props: Props) => {
    const classes = useStyles({});

    const [name, setName] = useState(props.event.name);
    const [eventType, setEventType] = useState(props.event.eventType);
    const [description, setDescription] = useState(props.event.description);
    const [startTime, setStartTime] = useState(props.event.startTime);
    const [registrationStart, setRegistrationStart] = useState(props.event.registrationStart);
    const [registrationEnd, setRegistrationEnd] = useState(props.event.registrationEnd);
    const [registrationEndInfo, setRegistrationEndInfo] = useState(props.event.registrationEndInfo);

    const nameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newName = e.currentTarget.value;
        setName(newName);
    };

    const eventTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newEventType = e.currentTarget.value;
        setEventType(newEventType);
    };

    const descriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newDescription = e.currentTarget.value;
        setDescription(newDescription);
    };

    const startDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const isValidDate = (d:Date) => !isNaN(d.getTime());
        const timeComponent = isValidDate(startTime) ? `T${moment(startTime).format("HH:mm")}` : '';
        const newStartTime = new Date(`${e.currentTarget.value}${timeComponent}`);
        if (isValidDate(newStartTime)) {
            setStartTime(new Date(newStartTime));
        }
    };

    const startTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newStartTime = `${moment(startTime).format("YYYY-MM-DD")}T${e.currentTarget.value}`;
        setStartTime(new Date(newStartTime));
    };

    const registrationStartChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newRegistrationStart = e.currentTarget.value;
        setRegistrationStart(new Date(newRegistrationStart));
    };

    const registrationEndChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newRegistrationEnd = e.currentTarget.value;
        setRegistrationEnd(new Date(newRegistrationEnd));
    };

    const save = () => {
        props.saveEventCallback(name, eventType, description, startTime, registrationStart,
            registrationEnd, registrationEndInfo);
    }

    return (
        <React.Fragment>
            <form noValidate autoComplete="off">
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <TextField id="name" label="Navn" onChange={nameChange} value={name}/>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <TextField
                            id="start-date"
                            label="Dato"
                            type="date"
                            value={moment(startTime).format("YYYY-MM-DD")}
                            onChange={startDateChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <TextField id="event-type" label="Øvelse" value={eventType} onChange={eventTypeChange}/>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                    <TextField
                        id="start-time"
                        label="Første start"
                        type="time"
                        value={moment(startTime).format("HH:mm")}
                        onChange={startTimeChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                            inputProps={{
                            step: 300, // 5 min
                        }}
                    />
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                    <TextField
                        id="registration-start"
                        label="Påmelding åpner"
                        type="datetime-local"
                        value={moment(registrationStart).format("YYYY-MM-DDTHH:mm")}
                        onChange={registrationStartChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                    <TextField
                        id="registration-end"
                        label="Påmeldingsfrist"
                        type="datetime-local"
                        value={moment(registrationEnd).format("YYYY-MM-DDTHH:mm")}
                        onChange={registrationEndChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <TextField id="description" label="Arrangementsinfo"
                            value={description} onChange={descriptionChange}
                            multiline rows={5}/>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl sx={(theme) => ({marginBottom: theme.spacing(1)})}fullWidth>
                        <TextField disabled id="startListGenerated" label="Startliste generert"
                            defaultValue={props.event.startListGenerated ? "Ja" : "Nei"}
                            InputProps={{classes: classes}}/>
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField disabled id="startListPublished" label="Startliste publisert"
                            defaultValue={props.event.startListPublished ? "Ja" : "Nei"}
                            InputProps={{classes: classes}} />
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <TextField id="registrationEndInfo" label="Etteranmeldingsinfo" value={registrationEndInfo}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setRegistrationEndInfo(e.target.value)}
                            multiline rows={4}/>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={save}>Lagre</Button>
                </Grid>
            </Grid>
            </form>
        </React.Fragment>
    )
}

export default EventInfo;
