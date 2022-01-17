import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import MaterialTable from 'material-table';
import Event from '../../model/event';
import Participant from '../../model/participant';
import Firebase from '../Firebase';
import { parse } from 'papaparse';

interface Props {
    event: Event
}

const ImportParticipants: React.FC<Props> = (props: Props) => {
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");
    const [participants, setParticipants] = useState<Participant[]>([]);
    const handleClose = () => {
        setShow(false);
        setParticipants([]);
        setError("");
    }
    const handleShow = () => setShow(true);

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
            console.log(mapped);
            setParticipants(mapped);
        }
        parse(fileList[0], {complete: handleParsed, header:true});
    };

    const columns = [
        {title: 'Fornavn', field: 'firstName'},
        {title: 'Etternavn', field: 'lastName'},
        {title: 'Klubb', field: 'club'},
        {title: 'Klasse', field: 'eventClass'}
    ];

    const doImport = () => {
        (async () => {
            await Firebase.updateParticipants(props.event.id, participants)
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
                    
                    { !error ? (
                        <Alert severity="warning">Advarsel! Import vil overskrive alle deltakere.</Alert>
                        ) : null
                    }
                    <input
                        accept=".csv"
                        id="file-upload"
                        name="file"
                        type="file"
                        multiple={false}
                        onChange={handleFileChange}
                    />

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
        </React.Fragment>
    );
}

export default ImportParticipants;