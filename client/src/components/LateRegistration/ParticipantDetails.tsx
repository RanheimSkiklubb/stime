import React, { useState, ChangeEvent } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

import Club from '../../model/club';
import Event from '../../model/event';
import _ from 'lodash';
import Participant from '../../model/participant';


interface Props {
    event: Event;
    clubs: Club[];
    eventClass: string;
    startNumber: number;
    startTime: string;
    registerCallback: (participant: Participant) => void;
}

const ParticipantDetails: React.FC<Props> = (props: Props) => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [club, setClub] = useState("");
    const [firstNameValid, setFirstNameValid] = useState(true);
    const [lastNameValid, setLastNameValid] = useState(true);
    const [formValid, setFormValid] = useState(false);


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
    const clubChange = (newClub: string) => {
        setClub(newClub);
    };

    const validateForm = (changedValue: any) => {
        const firstNameValue = changedValue['firstName'] || firstName;
        const lastNameValue = changedValue['lastName'] || lastName;
        setFormValid(firstNameValue.length > 0 && lastNameValue.length > 0);
    };

    const handleRegister = () => {
        const participant: Participant = {
            startNumber: props.startNumber, 
            startTime: props.startTime, 
            firstName, 
            lastName, 
            club, 
            eventClass: props.eventClass
        };
        props.registerCallback(participant);
    };

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
                
                <Grid item xs={12} style={{textAlign: 'right'}}>
                    <Button className="float-right" variant="contained" color="primary" onClick={handleRegister}
                            disabled={!formValid}>Meld på</Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default ParticipantDetails;