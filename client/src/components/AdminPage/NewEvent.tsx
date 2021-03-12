import React, {useEffect, useState, ChangeEvent} from "react";
import {useHistory} from "react-router-dom";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import Event from '../../model/event';
import Firebase from '../Firebase';
import moment from 'moment';

interface Props {
    baseEventCallback: (event: Event) => void;
}

const NewEvent: React.FC<Props> = (props: Props) => {
    const history = useHistory();
    const [showDialog, setShowDialog] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const [eventId, setEventId] = useState("");

    useEffect(() => {
        const fetchEvents = async () => {
            const loadedEvents = await Firebase.fetchEvents();
            setEvents(loadedEvents);
        }
        fetchEvents()
    });

    const eventChange = (event: ChangeEvent<{ value: unknown }>) => {
        const newEvent = event.target.value as string;
        setEventId(newEvent);
    };

    const handleCancelClick = () => {
        history.push("/");
    }

    const handleOkClick = () => {
        let event: Event;
        if (!eventId) {
            event = new Event("", "", "", "", new Date(), new Date(), new Date(), "", false, false, [], [])
        }
        else {
            const baseEvent = events.filter(eventItem => eventItem.id === eventId)[0];
            const eventClasses = baseEvent.eventClasses.map(eventClass => ({startInterval: eventClass.startInterval, reserveNumbers: eventClass.reserveNumbers, order: eventClass.order, name: eventClass.name, course: eventClass.course, description: eventClass.description}));
            event = new Event("", baseEvent.name + " (kopi)", baseEvent.eventType, baseEvent.description, new Date(), new Date(), 
                new Date(), baseEvent.registrationEndInfo, false, false, eventClasses, []);
        }
        props.baseEventCallback(event);
        setShowDialog(false);
    }

    return (
        <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="sm" fullWidth={true} disableBackdropClick={true} disableEscapeKeyDown={true}>
            <DialogTitle id="form-dialog-title" style={{textAlign: 'center'}}>Velg utgangspunkt for nytt arrangement</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <NativeSelect inputProps={{id: 'event-class-label'}} onChange={eventChange}>
                        <option value="">Tomt arrangement</option>
                        {events.map(event => 
                            (<option value={event.id} key={event.id}>{`${moment(event.startTime).format('DD.MM.YYYY')}: ${event.name}`}</option>))}
                    </NativeSelect>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="default" onClick={handleCancelClick}>Avbryt</Button>
                <Button variant="contained" color="primary" onClick={handleOkClick}>Ok</Button>
            </DialogActions>
        </Dialog>
    );

}

export default NewEvent;