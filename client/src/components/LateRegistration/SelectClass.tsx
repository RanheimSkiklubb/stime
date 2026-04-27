import {ChangeEvent, useState} from 'react';
import Stack from '@mui/material/Stack';
import NativeSelect from '@mui/material/NativeSelect';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Event from '../../model/event';
import Box from '@mui/material/Box';
import {sortBy} from 'lodash';


interface Props {
    event: Event;
    nextCallback: (eventClass: string) => void;
}

const SelectClass = (props: Props) => {

    const [eventClass, setEventClass] = useState("");
    const eventClassChange = (event: ChangeEvent<{ value: unknown }>) => {
        const newEventClass = event.target.value as string;
        setEventClass(newEventClass);
    };

    const handleNext = () => {
        props.nextCallback(eventClass);
    }

    return (
        <form noValidate autoComplete="off">
            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                <FormControl fullWidth sx={{ width: '75%' }}>
                    <InputLabel htmlFor="event-class-label">Klasse</InputLabel>
                    <NativeSelect inputProps={{id: 'event-class-label'}} value={eventClass}
                                onChange={eventClassChange}>
                        <option value=""></option>
                        {sortBy(props.event.eventClasses, 'order').map(eventClass => (<option value={eventClass.name}
                                                                            key={eventClass.name}>{`${eventClass.name} (${eventClass.course})`}</option>))}
                    </NativeSelect>
                </FormControl>
                <Box sx={{ m: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleNext}
                            disabled={eventClass === ""}>Neste</Button>
                </Box>
            </Stack>
        </form>
    );
}

export default SelectClass;