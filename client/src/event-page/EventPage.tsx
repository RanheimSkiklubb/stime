import React from 'react';
import Event from '../Event';
import Participant from '../Participant';
import { match } from "react-router-dom";
import moment from 'moment';
import Table from 'react-bootstrap/Table';
import RegistrationModal from './RegistrationModal';
import Club from '../model/club';


interface State {
    event: Event,
    clubs: Club[]
}

interface MatchParams {
    eventId: string
}

interface Props {
    match?: match<MatchParams>
}


export default class EventPage extends React.Component<Props, State> {
    

    async componentDidMount() {
        if (!this.props.match) {
            console.error("Props.match not set!");
            return;
        }
        const eventId = this.props.match.params.eventId;
        const eventBody = await fetch(`http://localhost:3000/api/event/${eventId}`)
        const eventData = await eventBody.json();
        const clubsBody = await fetch('http://localhost:3000/api/club')
        const clubsData = await clubsBody.json();
        
        const event = {id: eventData.id, name: eventData.name, startTime: eventData.startTime, eventClasses: eventData.eventClasses, participants: eventData.participants};
        this.setState({ event, clubs: clubsData });
        
    }

    render() {
        if (!this.state || !this.state.event) return "";
        const event = this.state.event;
        const clubs = this.state.clubs;
        return (
            <div>
                <h2>{event.name}</h2>
                <h3>{moment(event.startTime).format("DD. MMM YYYY")}</h3>
                <RegistrationModal event={event} clubs={clubs}/>
                <hr/>
                <h3>Deltakere</h3>
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
                        event.participants.map((p:Participant, idx:number) => 
                        <tr key={idx}><td>{idx + 1}</td>
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
}