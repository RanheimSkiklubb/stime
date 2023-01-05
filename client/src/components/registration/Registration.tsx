import {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import RegistrationForm from './RegistrationForm';

import Event from '../../model/event';
import Club from '../../model/club';
import Firebase from '../Firebase';


interface Props {
    event: Event,
}

const Registration = (props: Props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [clubs, setClubs] = useState<Club[]>([]);

    useEffect(() => {
        return Firebase.subscribeClubs(setClubs);
    }, []);

    return (
        <>
            <Button variant="contained" color="primary" size="medium" 
            onClick={handleShow}>Påmelding</Button>
            <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth={true}>
                <DialogTitle id="form-dialog-title" style={{textAlign: 'center'}}>Påmelding</DialogTitle>
                <DialogContent>
                    <RegistrationForm event={props.event} clubs={clubs} closeCallback={handleClose}/>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default Registration;