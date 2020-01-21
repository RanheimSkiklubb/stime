import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import RegistrationForm from './RegistrationForm';

import Event from '../../model/event';
import Club from '../../model/club';
import moment from "moment";


interface Props {
    event: Event,
    clubs: Club[],
    loadEventCallback: () => void
}

const Registration: React.FC<Props> = (props: Props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const registrationOpen = (event: Event):boolean => {
        const today = moment.now();
        return !moment().isBetween(event.registrationStart, event.registrationEnd);
    };

    return (
        <>
            <Button
                variant="contained"
                disabled={registrationOpen(props.event)}
                color="primary" style={{margin: '20px'}}
                size="large"
                onClick={handleShow}>
                Påmelding
            </Button>
            <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth={true}>
                <DialogTitle id="form-dialog-title" style={{textAlign: 'center'}}>Påmelding</DialogTitle>
                <DialogContent>
                    <RegistrationForm {...props} />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="default" onClick={handleClose}>Lukk</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Registration;