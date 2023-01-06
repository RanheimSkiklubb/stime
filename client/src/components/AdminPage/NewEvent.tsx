import { useEffect, useState, ChangeEvent} from "react";
import {Redirect, useHistory} from "react-router-dom";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import NativeSelect from '@mui/material/NativeSelect';
import FormControl from '@mui/material/FormControl';
import Event from '../../model/event';
import Firebase from '../Firebase';
import moment from 'moment';

interface Props {
}

const NewEvent = (props: Props) => {
    const history = useHistory();
    const [showDialog, setShowDialog] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const [eventId, setEventId] = useState("");
    const [redirect, setRedirect] = useState(false);

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

    const handleOkClick = async () => {
        let event: Event;
        if (!eventId) {
            event = new Event("", "", "", "", new Date(), new Date(), new Date(), "", false, false, [], [], [])
        }
        else {
            const baseEvent = events.filter(eventItem => eventItem.id === eventId)[0];
            const eventClasses = baseEvent.eventClasses.map(eventClass => ({startInterval: eventClass.startInterval, reserveNumbers: eventClass.reserveNumbers, order: eventClass.order, name: eventClass.name, course: eventClass.course, description: eventClass.description}));
            event = new Event("", baseEvent.name + " (kopi)", baseEvent.eventType, baseEvent.description, new Date(), new Date(),
                new Date(), baseEvent.registrationEndInfo, false, false, baseEvent.startGroups, eventClasses, []);
        }
        const savedEvent = await Firebase.createNewEvent(event);
        setShowDialog(false);
        setEventId(savedEvent.id);
        setRedirect(true);
    }

    if (redirect) {
        const url = `/admin/${eventId}`;
        return (<Redirect to={url}/>);
    }

    return (
        <Dialog
            open={showDialog}
            onClose={() => setShowDialog(false)}
            maxWidth="sm"
            fullWidth={true}
            disableEscapeKeyDown={true}>
            <DialogTitle id="form-dialog-title" sx={{textAlign: 'center'}}>Velg utgangspunkt for nytt arrangement</DialogTitle>
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
                <Button variant="contained" onClick={handleCancelClick}>Avbryt</Button>
                <Button variant="contained" color="primary" onClick={handleOkClick}>Ok</Button>
            </DialogActions>
        </Dialog>
    );

}

export default NewEvent;
