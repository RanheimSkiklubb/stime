import React from 'react';
import Event from '../../model/event';
import _ from 'lodash';
import MaterialTable from 'material-table';
import Firebase from '../Firebase';
import Participant from '../../model/participant';

interface Props {
    event: Event;
}

interface Row {
    name: string,
    club: string,
    eventClass: string
}

const startListColumns = [
    {title: 'Startnr', field: 'startNumber'},
    {title: 'Starttid', field: 'startTime'},
    {title: 'Fornavn', field: 'firstName'},
    {title: 'Etternavn', field: 'lastName'},
    {title: 'Klubb', field: 'club'},
    {title: 'Klasse', field: 'eventClass'}
];

const participantListColumns = [
    {title: 'Fornavn', field: 'firstName'},
    {title: 'Etternavn', field: 'lastName'},
    {title: 'Klubb', field: 'club'},
    {title: 'Klasse', field: 'eventClass'}
];

const ParticipantEdit: React.FC<Props> = (props: Props) => {

    const sortMapping: Record<string, number> = {};
    props.event.eventClasses.forEach((ec, idx) => sortMapping[ec.name] = idx);
    const participants = props.event.participants;
    const sortedParticipants = props.event.hasStartList ? _.sortBy(participants, "startNumber") : _.sortBy(participants, ["sort1", "sort2"]);
    const data:Participant[] = sortedParticipants;

    const typefixInput = (participant: any) => {
        if (participant.startNumber) {
            participant.startNumber = +participant.startNumber;
        }
    }

    return (
        <MaterialTable
            title=""
            columns = {props.event.hasStartList ? startListColumns : participantListColumns}
            data = {data}
            options={{
                sorting: false,
                paging: false,
                padding: "dense"
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


    ); 
}

export default ParticipantEdit;