import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import MaterialTable from 'material-table';
import Event from '../../model/event';
import EventClass from '../../model/event-class';
import Participant from '../../model/participant';
import Firebase from '../Firebase';
import { parse } from 'papaparse';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import HelpIcon from '@mui/icons-material/Help';

interface Props {
    event: Event
}

const ImportParticipants: React.FC<Props> = (props: Props) => {
    const [show, setShow] = useState(false);
    const [importEventClasses, setImportEventClasses] = useState(true);
    const [importParticipants, setImportParticipants] = useState(true);
    const [error, setError] = useState("");
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [eventClasses, setEventClasses] = useState<EventClass[]>([]);
    const handleClose = () => {
        setShow(false);
        setParticipants([]);
        setError("");
    }
    const handleShow = () => setShow(true);

    const importEventClassesChange = () => {
        setImportEventClasses(!importEventClasses);
    };

    const importParticipantsChange = () => {
        setImportParticipants(!importParticipants);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList) return;
        const handleParsed = (parsed:any) => {
            let mapped = [];
            try {
                mapped = parsed.data.map((item:any) => {
                    if  (!('firstName' in item) || !('lastName' in item) || !('club' in item) || !('eventClass' in item)) {
                        throw Error("Illegal format");
                    }
                    return {
                        firstName: item.firstName,
                        lastName: item.lastName,
                        club: item.club,
                        eventClass: item.eventClass
                    }
                });
            }
            catch (error) {
                setError("Ugyldig format på importfila");
            }
            setParticipants(mapped);
            setEventClasses(createEventClasses(mapped));
        }
        parse(fileList[0], {complete: handleParsed, header:true});
    };

    const columns = [
        {title: 'Fornavn', field: 'firstName'},
        {title: 'Etternavn', field: 'lastName'},
        {title: 'Klubb', field: 'club'},
        {title: 'Klasse', field: 'eventClass'}
    ];

    const createEventClasses = (participants: Participant[]):EventClass[] => {
        const eventClassNames = new Set<string>(participants.map(item => item.eventClass));
        const eventClasses:EventClass[] = [];
        Array.from(eventClassNames).forEach((name, idx) => eventClasses.push({startInterval: 30, reserveNumbers:0, order:idx, name, course:"", description:""}))
        return eventClasses;
    }

    const doImport = () => {
        (async () => {
            if (importParticipants) {
                await Firebase.updateParticipants(props.event.id, participants)
            }
            if (importEventClasses) {
                await Firebase.updateEventClasses(props.event.id, eventClasses);
            }
        })();
        handleClose();
    };

    return (
        <React.Fragment>
            <Button variant="contained" color="primary" size="medium" 
                onClick={handleShow}>Importer deltakere</Button>
            <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth={true}>
                <DialogTitle id="form-dialog-title" style={{textAlign: 'center'}}>Importer deltakere</DialogTitle>
                <DialogContent>
                    { error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : null
                    }
                    
                    { !error && props.event.participants.length > 0 ? (
                        <Alert severity="warning">Advarsel! Import vil overskrive alle klasser og deltakere.</Alert>
                        ) : null
                    }
                    <input
                        accept=".csv"
                        id="file-upload"
                        name="file"
                        type="file"
                        multiple={false}
                        onChange={handleFileChange}
                        style={{'color': 'white'}}
                    />

                    <Tooltip title="CSV column names: firstName, lastName, eventClass, club" style={{'float':'right'}}>
                        <IconButton color="primary">
                            <HelpIcon />
                        </IconButton>
                    </Tooltip>

                    <FormGroup row>
                        <FormControlLabel control={<Checkbox defaultChecked value={importEventClasses} onChange={importEventClassesChange}/>} 
                            label={'Importer klasser' + (eventClasses.length > 0 ? `(${eventClasses.length})` : "")} 
                        />
                        <FormControlLabel control={<Checkbox defaultChecked value={importParticipants} onChange={importParticipantsChange}/>} 
                            label={'Importer deltakere' + (participants.length > 0 ? `(${participants.length})` : "")} 
                            />
                    </FormGroup>

                    <MaterialTable
                        title = 'Deltakere'
                        columns = {columns}
                        data = {participants}
                        options={{
                            paging: false,
                            padding: "dense",
                            exportDelimiter: ';'
                        }}
                    />

                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={doImport} 
                        disabled={participants.length === 0 || (!importEventClasses && !importParticipants)}>Importer</Button>
                    <Button variant="contained" onClick={handleClose}>Avbryt</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default ImportParticipants;