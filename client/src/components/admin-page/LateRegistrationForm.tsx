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
import Firebase from '../Firebase';

interface Props {
    event: Event,
    clubs: Club[]
}

const RegistrationForm: React.FC<Props> = (props: Props) => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [club, setClub] = useState("");
    const [eventClass, setEventClass] = useState("");
    const [firstNameValid, setFirstNameValid] = useState(true);
    const [lastNameValid, setLastNameValid] = useState(true);
    const [clubValid, setClubValid] = useState(true);
    const [eventClassValid, setEventClassValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [formValid, setFormValid] = useState(false);


    const handleRegister = () => {
        const participant:Participant = {
            firstName,
            lastName,
            club,
            eventClass
        }
        try {
            (async () => {
                await Firebase.addParticipant(props.event.id, participant);
            })();
            alert("Deltaker påmeldt!");
        }
        catch (error) {
            console.error(error);
        }
    }

    const firstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newFirstName = event.currentTarget.value;
        setFirstName(newFirstName);
        const newFirstNameValid = newFirstName.length > 0;
        setFirstNameValid(newFirstNameValid);
        validateForm({firstName: newFirstName});
    };
    const lastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newLastName = event.currentTarget.value;
        setLastName(newLastName);
        const newLastNameValid = newLastName.length > 0;
        setLastNameValid(newLastNameValid);
        validateForm({lastName: newLastName});
    };
    const eventClassChange = (event: ChangeEvent<{ value: unknown }>) => {
        const newEventClass = event.target.value as string;
        setEventClass(newEventClass);
        setEventClassValid(newEventClass.length > 0);
        validateForm({eventClass: newEventClass});
    };
    const clubChange = (newClub: string) => {
        setClub(newClub);
        const newClubValid = !_.isNil(newClub) && newClub.length > 0;
        setClubValid(newClubValid);
        validateForm({club: newClub});
    };

    const validateForm = (changedValue: any) => {
        const firstNameValue = changedValue['firstName'] || firstName;
        const lastNameValue = changedValue['lastName'] || lastName;
        const clubValue = changedValue['club'] || club;
        const eventClassValue = changedValue['eventClass'] || eventClass;
        setFormValid(firstNameValue.length > 0 && lastNameValue.length > 0 && clubValue.length > 0 
            && eventClassValue.length > 0);
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
                                const newClubValid = !_.isNil(newValue) && newValue.length > 0;
                                setClubValid(newClubValid);
                                validateForm({club: newValue});
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
                <Grid item xs={12} style={{textAlign: 'right'}}>
                    <Button className="float-right" variant="contained" color="primary" onClick={handleRegister}
                            disabled={!formValid}>Neste</Button>
                </Grid>
            </Grid>
        </form>
    );
}

export default RegistrationForm;