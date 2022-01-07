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
import { isNil, sortBy } from 'lodash';
import Participant from '../../model/participant';

interface Props {
    event: Event;
    clubs: Club[];
    participant: Participant;
    email: string;
    phone: string;
    nextCallback: (participant: Participant, email: string, phone:string) => void;
    closeCallback: () => void;
}

const Step1: React.FC<Props> = (props: Props) => {

    const [firstName, setFirstName] = useState(props.participant.firstName);
    const [lastName, setLastName] = useState(props.participant.lastName);
    const [club, setClub] = useState(props.participant.club);
    const [eventClass, setEventClass] = useState(props.participant.eventClass);
    const [email, setEmail] = useState(props.email);
    const [phone, setPhone] = useState(props.phone);
    const [firstNameValid, setFirstNameValid] = useState(true);
    const [lastNameValid, setLastNameValid] = useState(true);
    const [eventClassValid, setEventClassValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [phoneValid, setPhoneValid] = useState(true);

    const formValid = (firstName.length > 0 && lastName.length > 0 && 
        eventClass.length > 0 && email.length > 0 && emailValid && 
        phone.length > 0 && phoneValid);

    const firstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newFirstName = event.currentTarget.value;
        setFirstName(newFirstName);
        const newFirstNameValid = newFirstName.length > 0;
        setFirstNameValid(newFirstNameValid);
    };

    const lastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newLastName = event.currentTarget.value;
        setLastName(newLastName);
        const newLastNameValid = newLastName.length > 0;
        setLastNameValid(newLastNameValid);
    };

    const eventClassChange = (event: ChangeEvent<{ value: unknown }>) => {
        const newEventClass = event.target.value as string;
        setEventClass(newEventClass);
        setEventClassValid(newEventClass.length > 0);
    };

    const clubChange = (newClub: string) => {
        setClub(newClub);
    };

    const emailChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newEmail = event.currentTarget.value;
        setEmail(newEmail);
        const newEmailValid = validateEmail(newEmail) && newEmail.length > 0;
        setEmailValid(newEmailValid);
    };

    const isInteger = (val: string): boolean => !isNaN(Number(val));

    const phoneChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newPhone = event.currentTarget.value;
        if (isInteger(newPhone)) {
            setPhone(newPhone);
        }
        const newPhoneValid = validatePhone(newPhone);
        setPhoneValid(newPhoneValid);
    };

    const validateEmail  = (email: string) => {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
    };

    const validatePhone  = (phone: string) => {
        return (phone.length === 8 && isInteger(phone));
    };

    const handleNext = () => {
        const participant: Participant = {firstName, lastName, club, eventClass};
        props.nextCallback(participant, email, phone)
    }

    const handleClose = () => {
        props.closeCallback();
    }

    let tempValue: string;
    return (
        <form noValidate autoComplete="off">
            <Grid container spacing={2}>
                <Grid item xs={12} style={{textAlign: 'center', fontWeight: 'bold'}}>
                    <p>Steg 1 av 2: Registrer deltaker</p>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <TextField required id="firstName" label="Fornavn" value={firstName} onChange={firstNameChange}
                                error={!firstNameValid}/>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <TextField required id="lastName" label="Etternavn" value={lastName} onChange={lastNameChange}
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
                                clubChange(isNil(newValue) ? "" : newValue);
                            }}
                            onInputChange={(event: any, newValue: any) => {
                                tempValue = newValue; //neccessary due to bug in <Autocomplete>. Should be able to set state directly
                            }}
                            onClose={(event: any) => {
                                if (tempValue) {
                                    clubChange(tempValue);
                                }
                            }}
                            renderInput={params => (
                                <TextField {...params} label="Klubb" margin="normal" fullWidth
                                        InputProps={{...params.InputProps, type: 'search'}}
                                        style={{marginTop: '0'}}/>
                            )}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel required htmlFor="event-class-label">Klasse</InputLabel>
                        <NativeSelect inputProps={{id: 'event-class-label'}} value={eventClass}
                                    onChange={eventClassChange} error={!eventClassValid}>
                            <option value=""></option>
                            {sortBy(props.event.eventClasses, 'order').map(eventClass => (<option value={eventClass.name}
                                                                                key={eventClass.name}>{`${eventClass.name} (${eventClass.course})`}</option>))}
                        </NativeSelect>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <TextField required id="email" label="Kontakt e-post" value={email} onChange={emailChange}
                                error={!emailValid}/>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <TextField required id="phone" label="Kontakt telefon" value={phone} onChange={phoneChange}
                                error={!phoneValid}/>
                    </FormControl>
                </Grid>
                <Grid container style={{margin: '20px 8px 20px 8px'}}>
                    <Grid item xs={6}><Button variant="contained" color="default" onClick={handleClose}>Lukk</Button></Grid>
                    <Grid item xs={6} style={{textAlign: 'right'}}>
                        <Button className="float-right" variant="contained" color="primary" onClick={handleNext}
                            disabled={!formValid}>Gå videre</Button>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    )
}

export default Step1;