import React from 'react';
import Event from '../../model/event';
import _ from 'lodash';
import MaterialTable from 'material-table';

interface Props {
    event: Event;
}

interface Row {
    name: string,
    club: string,
    eventClass: string
}

const columns = [
    {title: 'Name', field: 'name'},
    {title: 'Klubb', field: 'club'},
    {title: 'Klasse', field: 'eventClass'}
];

const ParticipantList: React.FC<Props> = (props: Props) => {

    const sortMapping: Record<string, number> = {};
    props.event.eventClasses.forEach((ec, idx) => sortMapping[ec.name] = idx);
    const participants = props.event.participants.map(p => {
        const name = `${p.firstName} ${p.lastName}`;
        return {name, club: p.club, eventClass: p.eventClass, sort1: sortMapping[p.eventClass], sort2: name.toLowerCase()};
    });
    const sortedParticipants = _.sortBy(participants, ["sort1", "sort2"]);

    return (
        <MaterialTable
            title=""
            columns = {columns}
            data = {sortedParticipants}
            options={{
                sorting: true,
                paging: false,
                padding: "dense"
            }}
            style={{marginBottom: '10px'}}
        />


    ); 
}

export default ParticipantList;