import {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import LateRegistrationForm from './LateRegistrationForm';

import Event from '../../model/event';
import Club from '../../model/club';
import Firebase from '../Firebase';

interface Props {
    event: Event,
    className?: string,
    caption: string
}

const LateRegistration = (props: Props) => {
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
                onClick={handleShow} className={props.className}>{props.caption}</Button>
            <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth={true}>
                <DialogTitle id="form-dialog-title" style={{textAlign: 'center'}}>Etteranmelding</DialogTitle>
                <DialogContent>
                    <LateRegistrationForm event={props.event} clubs={clubs} closeCallback={handleClose}/>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose}>Lukk</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default LateRegistration;