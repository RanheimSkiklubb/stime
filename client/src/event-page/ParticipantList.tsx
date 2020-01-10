import React from 'react';
import './EventPage.css';
import Event from '../model/event';
import Participant from '../model/participant';
import Table from 'react-bootstrap/Table';

interface Props {
    event: Event;
}

const ParticipantList: React.FC<Props> = (props: Props) => {

    return (
        <Table striped bordered size="sm">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Navn</th>
                    <th>Klubb</th>
                    <th>Klasse</th>
                </tr>
            </thead>
            <tbody>
                {
                props.event.participants.map((p:Participant, idx:number) => 
                <tr key={idx}><td>{idx + 1}</td>
                    <td>{p.firstName + " " + p.lastName}</td>
                    <td>{p.club}</td>
                    <td>{p.eventClass}</td>
                </tr>)
                }
            </tbody>
        </Table>
    );
    
}

export default ParticipantList;