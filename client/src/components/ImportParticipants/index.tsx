import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
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
    const [participants, setParticipants] = useState<Participant[]>([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList) return;
        const handleParsed = (parsed:any) => {
            const mapped = parsed.data.map((item:any) => {
                return {
                    firstName: item.Fornavn,
                    lastName: item.Etternavn,
                    club: item.Klubb,
                    eventClass: item.Klasse
                }
            })
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
    };

    return (
        <React.Fragment>
            <Button variant="contained" color="primary" size="medium" 
                onClick={handleShow}>Importer deltakere</Button>
            <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth={true}>
                <DialogTitle id="form-dialog-title" style={{textAlign: 'center'}}>Importer deltakere</DialogTitle>
                <DialogContent>
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

                    <Button variant="contained" color="primary" onClick={doImport} >Importer</Button>
                
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="default" onClick={handleClose}>Lukk</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default ImportParticipants;