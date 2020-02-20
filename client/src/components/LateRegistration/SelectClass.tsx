import React, { useState, ChangeEvent } from 'react';
import Grid from '@material-ui/core/Grid';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Event from '../../model/event';
import Box from '@material-ui/core/Box';


interface Props {
    event: Event;
    nextCallback: (eventClass: string) => void;
}

const SelectClass: React.FC<Props> = (props: Props) => {

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
            <Grid container direction="column" justify="center" alignItems="center">
                <Grid item xs={9}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="event-class-label">Klasse</InputLabel>
                        <NativeSelect inputProps={{id: 'event-class-label'}} value={eventClass}
                                    onChange={eventClassChange}>
                            <option value=""></option>
                            {props.event.eventClasses.map(eventClass => (<option value={eventClass.name}
                                                                                key={eventClass.name}>{`${eventClass.name} (${eventClass.course})`}</option>))}
                        </NativeSelect>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Box m={2}>
                        <Button variant="contained" color="primary" onClick={handleNext}
                                disabled={eventClass === ""}>Neste</Button>
                    </Box>
                </Grid>
            </Grid>
        </form>
    )
}

export default SelectClass;