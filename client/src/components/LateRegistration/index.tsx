import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import LateRegistrationForm from './LateRegistrationForm';

import Event from '../../model/event';
import Club from '../../model/club';
import Firebase from '../Firebase';


interface Props {
    event: Event;
    className?: string;
    caption: string;
}

const LateRegistration: React.FC<Props> = (props: Props) => {
    const [show, setShow] = useState(false);
    const [time, setTime] = useState(60);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [clubs, setClubs] = useState<Club[]>([]);

    useEffect(() => {
        return Firebase.subscribeClubs(setClubs);
    }, []);

    const tick = () => {
        console.log("Tick. Time: " + time);
        const newTime = time - 1;
        if (newTime === 0) {
            handleClose();
        }
        console.log(newTime);
        setTime(newTime);
    }

    const resetTimer = () => {
        setTime(60);
    }

    useEffect(() => {
        const timerId = window.setTimeout(() => tick(), 1000);
        return function cleanup() {
            clearInterval(timerId);
        }
    });

    return (
        <React.Fragment>
            <Button variant="contained" color="primary" size="medium" 
                onClick={handleShow} className={props.className}>{props.caption}</Button>
            <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth={true}>
                <DialogTitle id="form-dialog-title" style={{textAlign: 'center'}}>Etteranmelding</DialogTitle>
                <DialogContent>
                    <LateRegistrationForm event={props.event} clubs={clubs} closeCallback={handleClose} 
                        resetTimerCallback={resetTimer}/>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="default" onClick={handleClose}>Lukk ({time})</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default LateRegistration;