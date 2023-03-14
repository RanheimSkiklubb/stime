import {ChangeEvent, useState} from 'react';
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
import {parse} from 'papaparse';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';

interface Props {
    event: Event
}

enum ImportAction {
    overwrite, append
}

const ImportParticipants = (props: Props) => {
    const [show, setShow] = useState(false);
    const [importEventClasses, setImportEventClasses] = useState(false);
    const [importEventClassesEnabled, setImportEventClassesEnabled] = useState(true);
    const [importAction, setImportAction] = useState<ImportAction>(ImportAction.overwrite);
    const [error, setError] = useState("");
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [eventClasses, setEventClasses] = useState<EventClass[]>([]);
    
    async function handleClose() {
        await setShow(false);
        setParticipants([]);
        setEventClasses([]);
        setError("");
    }
    const handleShow = () => setShow(true);

    const importEventClassesChange = () => {
        setImportEventClasses(!importEventClasses);
    };

    const importParticipantsChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === ImportAction.overwrite.toString()) {
            setImportAction(ImportAction.overwrite);
            setImportEventClassesEnabled(true);
        }
        else {
            setImportAction(ImportAction.append);
            setImportEventClasses(false);
            setImportEventClassesEnabled(false);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setError("");
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
        parse(fileList[0], {complete: handleParsed, header:true, skipEmptyLines: 'greedy'});
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
            if (importAction === ImportAction.overwrite) {
                await Firebase.updateParticipants(props.event.id, participants);
            } else {
                await Firebase.addParticipants(props.event.id, participants);
            }
            if (importEventClasses && importEventClassesEnabled) {
                await Firebase.updateEventClasses(props.event.id, eventClasses);
            }
        })();
        handleClose();
    };

    const Warning = () => {
        if (error || props.event.participants.length === 0) {
            return (<></>);
        }
        if (importAction === ImportAction.overwrite) {
            let warningMessage;
            if (importEventClasses) {
                warningMessage = "Advarsel! Import vil overskrive alle klasser og deltakere";
            }
            else {
                warningMessage = "Advarsel! Import vil overskrive alle deltakere";
            }
            return (<Alert severity="warning">{warningMessage}</Alert>);
        } 
        else {
            return (<></>);
        }
    }

    return (
        <>
            <Button variant="contained" color="primary" size="medium" 
                onClick={handleShow}>Importer deltakere</Button>
            <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth={true}>
                <DialogTitle id="form-dialog-title" style={{textAlign: 'center'}}>Importer deltakere</DialogTitle>
                <DialogContent>
                    { error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : null
                    }
                    <Alert severity="info">CSV column names: firstName, lastName, eventClass, club</Alert>
                    <Warning/>
                    <input
                        accept=".csv"
                        id="file-upload"
                        name="file"
                        type="file"
                        multiple={false}
                        onChange={handleFileChange}
                        style={{'color': 'white'}}
                    />

                    <FormGroup row>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                            onChange={importParticipantsChange}
                            value={importAction}
                        >
                            <FormControlLabel value={ImportAction.overwrite} control={<Radio />} label="Overskriv deltakere" />
                            <FormControlLabel value={ImportAction.append} control={<Radio />} label="Legg til deltakere" />
                        </RadioGroup>
                        <FormControlLabel control={<Checkbox onChange={importEventClassesChange}
                            disabled={!importEventClassesEnabled} checked={importEventClasses}/>} style={{display:'table'}} 
                            label={'Importer og overskriv klasser' + (eventClasses.length > 0 ? `(${eventClasses.length})` : "")}
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
                    <Button variant="contained" color="primary" onClick={doImport} disabled={participants.length === 0}>Importer</Button>
                    <Button variant="contained" onClick={handleClose}>Avbryt</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ImportParticipants;