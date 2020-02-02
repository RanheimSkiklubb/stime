import React from 'react';
import Event from '../../model/event';
import _ from 'lodash';
import MaterialTable from 'material-table';
import Firebase from '../Firebase';
import Participant from '../../model/participant';
import Button from '@material-ui/core/Button';
import moment from 'moment';

interface Props {
    event: Event;
}

interface Row {
    name: string,
    club: string,
    eventClass: string
}

const ParticipantEdit: React.FC<Props> = (props: Props) => {

    const eventClasses:any = {};
    props.event.eventClasses.forEach(ec => eventClasses[ec.name] = ec.name);

    const startListColumns = [
        {title: 'Startnr', field: 'startNumber', type: 'numeric'},
        {title: 'Starttid', field: 'startTime'},
        {title: 'Fornavn', field: 'firstName'},
        {title: 'Etternavn', field: 'lastName'},
        {title: 'Klubb', field: 'club'},
        {title: 'Klasse', field: 'eventClass', lookup: eventClasses}
    ];

    const participantListColumns = [
        {title: 'Fornavn', field: 'firstName'},
        {title: 'Etternavn', field: 'lastName'},
        {title: 'Klubb', field: 'club'},
        {title: 'Klasse', field: 'eventClass', lookup: eventClasses}
    ];



    const sortMapping: Record<string, number> = {};
    props.event.eventClasses.forEach((ec, idx) => sortMapping[ec.name] = idx);
    const participants = props.event.participants;
    const sortedParticipants = props.event.startListGenerated ? _.sortBy(participants, "startNumber") : _.sortBy(participants, ["sort1", "sort2"]);
    const data:Participant[] = sortedParticipants;

    const typefixInput = (participant: any) => {
        if (participant.startNumber) {
            participant.startNumber = +participant.startNumber;
        }
    }

    const handleGenerate = () => {
        const participants = props.event.participants;
        let startNumber = 1;
        let startTime = moment(props.event.startTime);
        for (let eventClass of props.event.eventClasses) {
            const participantsInClass = _.shuffle(participants.filter(p => p.eventClass === eventClass.name));
            for (let p of participantsInClass) {
                p.startNumber = startNumber++;
                p.startTime = startTime.format("HH:mm:ss");
                startTime = startTime.add(eventClass.startInterval, 's')
            }
            startNumber += eventClass.reserveNumbers;
            startTime = startTime.add(eventClass.reserveNumbers * eventClass.startInterval, 's');
        }
        props.event.startListGenerated = true;
        (async () => {
            await Firebase.updateParticipants(props.event.id, props.event.participants);
            await Firebase.setStartListGenerated(props.event.id);
        })();
    }

    const handlePublish = () => {
        (async () => {
            await Firebase.setStartListPublished(props.event.id);
        })();
        alert("Startliste publisert!");
    }

    return (
        <>
            <div style={{padding: '10px'}}>
                <Button variant="contained" color="primary" onClick={handleGenerate}>Generer Startliste</Button>&nbsp;
                <Button variant="contained" color="primary" onClick={handlePublish}>Publiser Startliste</Button>
            </div>
            <MaterialTable
                title=""
                columns = {props.event.startListGenerated ? startListColumns : participantListColumns}
                data = {data}
                options={{
                    sorting: false,
                    paging: false,
                    padding: "dense",
                    exportButton: true,
                    exportDelimiter: ';'
                }}
                style={{marginBottom: '10px'}}
                editable={{
                    onRowAdd: newData =>
                        new Promise(resolve => {
                            resolve();
                            typefixInput(newData);
                            data.push(newData);
                            (async () => {
                                await Firebase.updateParticipants(props.event.id, data)
                            })();
                        }),
                    onRowUpdate: async (newData, oldData) =>
                        new Promise(resolve => {
                            resolve();
                            if (oldData) {
                                typefixInput(newData);
                                data[data.indexOf(oldData)] = newData;
                                (async () => {
                                    await Firebase.updateParticipants(props.event.id, data)
                                })();
                            }
                        })
                }}
            />
        </>

    ); 
}

export default ParticipantEdit;