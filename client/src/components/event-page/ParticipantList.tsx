import React from 'react';
import Event from '../../model/event';
import EventClass from '../../model/event-class';
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

const startListColumns = [
    {title: 'Startnr', field: 'startNumber'},
    {title: 'Starttid', field: 'startTime'},
    {title: 'Name', field: 'name'},
    {title: 'Klubb', field: 'club'},
    {title: 'Klasse', field: 'eventClass'}
];

const participantListColumns = [
    {title: 'Name', field: 'name'},
    {title: 'Klubb', field: 'club'},
    {title: 'Klasse', field: 'eventClass'}
];

const ParticipantList: React.FC<Props> = (props: Props) => {

    const sortMapping: Record<string, number> = props.event.eventClasses.reduce((p:any, c:EventClass) => {
        p[c.name] = c.order; 
        return p
    }, {});

    const participants = props.event.participants.map(p => {
        const name = `${p.firstName} ${p.lastName}`;
        return {startNumber: p.startNumber, startTime: p.startTime, name, club: p.club, eventClass: p.eventClass, sort1: sortMapping[p.eventClass], sort2: name.toLowerCase()};
    });
    const sortedParticipants = props.event.startListPublished ? _.sortBy(participants, "startNumber") : _.sortBy(participants, ["sort1", "sort2"]);

    return (
        <MaterialTable
            title=""
            columns = {props.event.startListPublished ? startListColumns : participantListColumns}
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