import React, { useState, ChangeEvent } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Alert from '@material-ui/lab/Alert';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import Club from '../../model/club';
import Event from '../../model/event';
import _ from 'lodash';
import Participant from '../../model/participant';
import RegisteredParticipant from './RegisteredParticipant';
import firebase from '../Firebase';
import { compareTwoStrings }  from 'string-similarity';

interface Props {
    event: Event,
    clubs: Club[]
}

const RegistrationForm: React.FC<Props> = (props: Props) => {

    const [progress, setProgress] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [club, setClub] = useState('');
    const [email, setEmail] = useState('');
    const [eventClass, setEventClass] = useState('');
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
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    };

    const validate = (newFirstName = firstName, newLastName = lastName, newClub = club, newEventClass = eventClass, newEmail = email) =>
        setFormValid(newFirstName.length > 0 && newLastName.length > 0 && newClub.length > 0 && newEventClass.length > 0 && newEmail.length > 0);

    const handleRegister = () => {
        try {
            const participant: Participant = {
                firstName: firstName,
                lastName: lastName,
                club: club,
                eventClass: eventClass
            };
            const contact = {
                name: firstName + " " + lastName,
                email: email
            };
            firebase.addParticipant(props.event.id, participant);
            firebase.addContact(props.event.id, contact);
            setProgress(2);
        }
        catch (error) {
            console.error(error);
        }
    }
    const handleRegisterMore = () => {
        setFirstName('');
        setEventClass('')
        setProgress(0);
    }
    const handleEdit = () => setProgress(0);
    const handleNext = () => setProgress(1);

    let tempValue: string;
    const form = (
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

    );

    const lookForSimilarRegistrations = (p: Participant, e: Event): Participant|null => {
        if (!e) return null;
        const generateKey = (p: Participant) => `${p.firstName}${p.lastName}${p.club}`;
        const key = generateKey(p);
        const similarities = e.participants.map((p: Participant) => {
            return {
                participant: p,
                similarity: compareTwoStrings(key, generateKey(p))
            }
        });
        const mostSimilar = similarities.reduce((p, c) => p.similarity > c.similarity ? p : c, {similarity: -1, participant: p});
        if (mostSimilar.similarity > 0.9) {
            return mostSimilar.participant;
        }
        return null;
    };

    const useStyles = makeStyles({
        similar: {
            '& td': {
                color: "grey"
            }
        },
    });
    const classes = useStyles();
    const step1 = () => {
        const participant = {firstName, lastName, club, eventClass};
        const contact = {name: firstName + ' ' + lastName, email};
        const similar = lookForSimilarRegistrations(participant, props.event);
        let similarNotification = null;
        if (similar) {
            similarNotification = (
                <React.Fragment>
                    <Grid item xs={12} sm={9}>
                        <Alert style={{marginTop: '10px', marginBottom: '10px', paddingTop: '0', paddingBottom: '0'}} severity="warning">Merk at det allerede finnes en liknende registrering:</Alert>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <RegisteredParticipant participant={similar} email={email} className={classes.similar}/>
                    </Grid>
                </React.Fragment>
            )
        }
        return (
            <Grid container direction="column" justify="center" alignItems="center">
                <Grid item xs={12}>
                    <p style={{fontWeight: 'bold'}}>Du har registrert følgende: </p>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <RegisteredParticipant participant={participant} email={email}/>
                </Grid>
                {similarNotification}
                <Grid container style={{marginTop: '20px'}}>
                    <Grid item xs={6}><Button variant="contained" color="primary" onClick={handleEdit}>Endre</Button></Grid>
                    <Grid item xs={6} style={{textAlign: 'right'}}><Button variant="contained" color="primary" className="float-right" onClick={handleRegister}>Meld på</Button></Grid>
                </Grid>
            </Grid>
        )
    };

    const step2 = (
        <div style={{textAlign: 'center', fontWeight: 'bold'}}>
            <p>Din påmelding er registrert!</p>
            <Button variant="contained" color="primary" className="float-right" onClick={handleRegisterMore}>Meld på flere</Button>
        </div>
    );

    if (progress === 0) {
        return form
    }
    if (progress === 1) {
        return step1();
    }
    return step2;

}

export default RegistrationForm;