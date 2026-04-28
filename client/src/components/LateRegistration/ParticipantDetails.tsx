import {ChangeEvent, useState} from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

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
    lastName: string;
    club: string;
    registerCallback: (participant: Participant) => void;
}

const disabledFieldSx = {
    '& .MuiInputBase-input.Mui-disabled': {
        color: 'dimgray',
        WebkitTextFillColor: 'dimgray',
    },
};

const ParticipantDetails = (props: Props) => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState(props.lastName);
    const [club, setClub] = useState(props.club);
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
                <Grid size={12}>
                    <FormControl fullWidth>
                        <TextField disabled id="eventClass" label="Klasse" defaultValue={props.eventClass} 
                            sx={disabledFieldSx}/>
                    </FormControl>
                </Grid>
                <Grid size={6}>
                    <FormControl fullWidth>
                        <TextField disabled id="startNumber" label="Startnummer" defaultValue={props.startNumber}
                            sx={disabledFieldSx}/>
                    </FormControl>
                </Grid>
                <Grid size={6}>
                    <FormControl fullWidth>
                        <TextField disabled id="startTime" label="Starttid" defaultValue={props.startTime}
                            sx={disabledFieldSx}/>
                    </FormControl>
                </Grid>
                <Grid size={6}>
                    <FormControl fullWidth>
                        <TextField id="firstName" label="Fornavn" value={firstName} onChange={firstNameChange}
                                error={!firstNameValid}/>
                    </FormControl>
                </Grid>
                <Grid size={6}>
                    <FormControl fullWidth>
                        <TextField id="lastName" label="Etternavn" value={lastName} onChange={lastNameChange}
                                error={!lastNameValid}/>
                    </FormControl>
                </Grid>
                <Grid size={6}>
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
                                        slotProps={{ input: { ...params.slotProps.input, type: 'search' } }}
                                        style={{marginTop: '0'}}/>
                            )}
                        />
                    </FormControl>
                </Grid>
                <Grid size={12} style={{textAlign: 'center'}}>
                    <Box sx={{ m: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleRegister}
                            disabled={!formValid}>Meld på</Button>
                    </Box>
                </Grid>
            </Grid>
        </form>
    )
}

export default ParticipantDetails;