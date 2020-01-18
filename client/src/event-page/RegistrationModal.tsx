import React, { useState, ChangeEvent } from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Event from '../model/event';
import Club from '../model/club';
import * as _ from "lodash";

interface Props {
    event: Event,
    clubs: Club[],
    loadEventCallback: () => void
}

const RegistrationForm: React.FC<Props> = (props: Props) => {

    const [progress, setProgress] = useState(0);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [club, setClub] = useState("");
    const [eventClass, setEventClass] = useState("Mini");
    const [firstNameValid, setFirstNameValid] = useState(true);
    const [lastNameValid, setLastNameValid] = useState(true);
    const [clubValid, setClubValid] = useState(true);
    const [formValid, setFormValid] = useState(false);

    const firstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        setFirstName(value);
        const newFirstNameValid = value.length > 0;
        setFirstNameValid(newFirstNameValid);
        validate(value);
    }
    const lastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        setLastName(value);
        const newLastNameValid = value.length > 0;
        setLastNameValid(newLastNameValid);
        validate(undefined, value);
    }
    const eventClassChange = (event: ChangeEvent<{ value: unknown }>) => {
        setEventClass(event.target.value as string);
    }
    const clubChange = (newClub:string) => {
        setClub(newClub);
        const newClubValid = !_.isNil(newClub) && newClub.length > 0;
        setClubValid(newClubValid);
        validate(undefined, undefined, newClub);
    }

    const validate = (newFirstName = firstName, newLastName = lastName, newClub = club) => 
        setFormValid(!_.isNil(newFirstName) && newFirstName.length > 0 && !_.isNil(newLastName) && newLastName.length > 0 && !_.isNil(newClub) && newClub.length > 0);

    const handleRegister = async () => {
        try {
            await fetch(`http://localhost:3001/api/event/1/participant`,
                {
                    method: 'POST',
                    body: JSON.stringify({ firstName, lastName, club, eventClass }),
                    headers: { 'Content-Type': 'application/json' }
                });
            props.loadEventCallback();
            setProgress(2);
        }
        catch (error) {
            console.error(error);
        }
    }
    const handleRegisterMore = () => {
        setFirstName("");
        setProgress(0);
    }
    const handleEdit = () => setProgress(0);
    const handleNext = () => setProgress(1);

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                '& > *': {
                    margin: theme.spacing(1),
                    width: 200,
                },
            },
        }),
    );
    const classes = useStyles();
    let tempValue: string;
    const form = (
        <form className={classes.root} noValidate autoComplete="off">
            <TextField id="firstName" label="Fornavn" value={firstName} onChange={firstNameChange} error={!firstNameValid} />
            <TextField id="lastName" label="Etternavn" value={lastName} onChange={lastNameChange} error={!lastNameValid} />
            <Autocomplete
                id="club"
                freeSolo
                value={club}
                options={props.clubs.map(club => club.name)}
                onChange={(event: any, newValue: any | null) => {
                    clubChange(newValue);
                }}
                onInputChange={(event: any, newValue: any) => {
                    tempValue = newValue; //neccessary due to bug in <Autocomplete>. Should be able to set state directlu
                    validate(undefined, undefined, newValue);
                }}
                onClose={(event: any) => {
                    if (tempValue) {
                        clubChange(tempValue);
                    }
                }}
                renderInput={params => (
                    <TextField {...params} label="Klubb" margin="normal" fullWidth InputProps={{ ...params.InputProps, type: 'search' }} error={!clubValid} />
                )}
            />
            <FormControl>
                <InputLabel id="event-class-label">Klasse</InputLabel>
                <Select labelId="event-class-label" id="eventClass" value={eventClass} onChange={eventClassChange}>
                    {props.event.eventClasses.map(eventClass => (<MenuItem value={eventClass.name} key={eventClass.name}>{`${eventClass.name} (${eventClass.course})`}</MenuItem>))}
                </Select>
            </FormControl>
            <Button className="float-right" variant="contained" color="primary" onClick={handleNext} disabled={!formValid}>Neste</Button>
        </form>
    );

    const step1 = (
        <div>
            <p>Du har registert følgende</p>

            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Fornavn</TableCell>
                            <TableCell>{firstName}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Etternavn</TableCell>
                            <TableCell>{lastName}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Klubb</TableCell>
                            <TableCell>{club}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Klasse</TableCell>
                            <TableCell>{eventClass}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Button variant="contained" color="primary" onClick={handleEdit}>Endre</Button>
            <Button variant="contained" color="primary" className="float-right" onClick={handleRegister}>Meld på</Button>
        </div>
    );

    const step2 = (
        <div>
            <p>Din påmelding er registrert!</p>
            <Button variant="contained" color="primary" className="float-right" onClick={handleRegisterMore}>Meld på flere</Button>
        </div>
    );

    if (progress === 0) {
        return form
    }
    if (progress === 1) {
        return step1;
    }
    return step2;

}

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            position: 'absolute',
            width: 400,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }),
);

const RegistrationModal: React.FC<Props> = (props: Props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [modalStyle] = React.useState(getModalStyle);
    const classes = useStyles();

    return (
        <>
            <Button variant="contained" color="primary" className="marginTop20" size="large" onClick={handleShow}>Påmelding</Button>
            <Modal open={show} onClose={handleClose}>
                <div style={modalStyle} className={classes.paper}>
                    <h3>Påmelding</h3>
                    <RegistrationForm event={props.event} clubs={props.clubs} loadEventCallback={props.loadEventCallback} />
                    <Button variant="contained" color="default" onClick={handleClose}>Lukk</Button>
                </div>
            </Modal>
        </>
    );
}

export default RegistrationModal;