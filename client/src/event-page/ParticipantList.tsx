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
        <div className="marginTop15">
            <Table striped bordered size="sm">
                <thead>
                    <tr>
                        <th>Navn</th>
                        <th>Klubb</th>
                        <th>Klasse</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    props.event.participants.map((p:Participant, idx:number) => 
                    <tr key={idx}>
                        <td>{p.firstName + " " + p.lastName}</td>
                        <td>{p.club}</td>
                        <td>{p.eventClass}</td>
                    </tr>)
                    }
                </tbody>
            </Table>
        </div>
    );
    
}

export default ParticipantList;