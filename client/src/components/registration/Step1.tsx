import React, { useState, ChangeEvent } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

import Club from '../../model/club';
import Event from '../../model/event';
import _ from 'lodash';
import Participant from '../../model/participant';


interface Props {
    event: Event;
    clubs: Club[];
    participant: Participant;
    email: string;
    nextCallback: (participant: Participant, email: string) => void;
}

const Step1: React.FC<Props> = (props: Props) => {

    const [firstName, setFirstName] = useState(props.participant.firstName);
    const [lastName, setLastName] = useState(props.participant.lastName);
    const [club, setClub] = useState(props.participant.club);
    const [eventClass, setEventClass] = useState(props.participant.eventClass);
    const [email, setEmail] = useState(props.email);
    const [firstNameValid, setFirstNameValid] = useState(true);
    const [lastNameValid, setLastNameValid] = useState(true);
    const [clubValid, setClubValid] = useState(true);
    const [eventClassValid, setEventClassValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [formValid, setFormValid] = useState(false);


    const firstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        setFirstName(value);
        const newFirstNameValid = value.length > 0;
        setFirstNameValid(newFirstNameValid);
        validate(value);
    };
    const lastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        setLastName(value);
        const newLastNameValid = value.length > 0;
        setLastNameValid(newLastNameValid);
        validate(undefined, value);
    };
    const eventClassChange = (event: ChangeEvent<{ value: unknown }>) => {
        const newEventClass = event.target.value as string;
        setEventClass(newEventClass);
        setEventClassValid(newEventClass.length > 0);
        validate(undefined, undefined, undefined, newEventClass);
    };
    const clubChange = (newClub: string) => {
        setClub(newClub);
        const newClubValid = !_.isNil(newClub) && newClub.length > 0;
        setClubValid(newClubValid);
        validate(undefined, undefined, newClub);
    };
    const emailChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        setEmail(value);
        const newEmailValid = validateEmail(value) && value.length > 0;
        setEmailValid(newEmailValid);
        validate(undefined, value);
    };

    const validateEmail  = (email: string) => {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
    };

    const validate = (newFirstName = firstName, newLastName = lastName, newClub = club, newEventClass = eventClass, newEmail = email) =>
        setFormValid(newFirstName.length > 0 && newLastName.length > 0 && newClub.length > 0 && newEventClass.length > 0 && newEmail.length > 0);

    const handleNext = () => {
        const participant = new Participant(firstName, lastName, club, eventClass);
        props.nextCallback(participant, email)
    }

    let tempValue: string;
    return (
        <form noValidate autoComplete="off">
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <TextField id="firstName" label="Fornavn" value={firstName} onChange={firstNameChange}
                                error={!firstNameValid}/>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <TextField id="lastName" label="Etternavn" value={lastName} onChange={lastNameChange}
                                error={!lastNameValid}/>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <Autocomplete
                            id="club"
                            freeSolo
                            value={club}
                            options={props.clubs.map(club => club.name)}
                            onChange={(event: any, newValue: any | null) => {
                                clubChange(_.isNil(newValue) ? "" : newValue);
                            }}
                            onInputChange={(event: any, newValue: any) => {
                                tempValue = newValue; //neccessary due to bug in <Autocomplete>. Should be able to set state directly
                                validate(undefined, undefined, newValue);
                            }}
                            onClose={(event: any) => {
                                if (tempValue) {
                                    clubChange(tempValue);
                                }
                            }}
                            renderInput={params => (
                                <TextField {...params} label="Klubb" margin="normal" fullWidth
                                        InputProps={{...params.InputProps, type: 'search'}} error={!clubValid}
                                        style={{marginTop: '0'}}/>
                            )}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="event-class-label">Klasse</InputLabel>
                        <NativeSelect inputProps={{id: 'event-class-label'}} value={eventClass}
                                    onChange={eventClassChange} error={!eventClassValid}>
                            <option value=""></option>
                            {props.event.eventClasses.map(eventClass => (<option value={eventClass.name}
                                                                                key={eventClass.name}>{`${eventClass.name} (${eventClass.course})`}</option>))}
                        </NativeSelect>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <TextField id="email" label="Kontakt e-post" value={email} onChange={emailChange}
                                error={!emailValid}/>
                    </FormControl>
                </Grid>
                <Grid item xs={6}></Grid><Grid item xs={6}></Grid>
                <Grid item xs={6} style={{textAlign: 'right'}}>
                    <Button className="float-right" variant="contained" color="primary" onClick={handleNext}
                            disabled={!formValid}>Neste</Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default Step1;