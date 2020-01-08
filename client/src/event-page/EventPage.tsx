import React from 'react';
import Event from '../Event';
import Participant from '../Participant';
import { match } from "react-router-dom";
import moment from 'moment';
import Table from 'react-bootstrap/Table';
import RegistrationModal from './RegistrationModal';


interface State {
    event: Event
}

interface MatchParams {
    eventId: string
}

interface Props {
    match?: match<MatchParams>
}


export default class EventPage extends React.Component<Props, State> {
    

    componentDidMount() {
        if (!this.props.match) {
            console.error("Props.match not set!");
            return;
        }
        const eventId = this.props.match.params.eventId;
        fetch(`http://localhost:3000/api/event/${eventId}`)
        .then(res => res.json())
        .then((data) => {
            const event = {id: data.id, name: data.name, startTime: data.startTime, eventClasses: data.eventClasses, participants: data.participants};
            this.setState({ event });
        })
        .catch(console.log)
    }

    render() {
        if (!this.state || !this.state.event) return "";
        const event = this.state.event;
        return (
            <div>
                <h2>{event.name}</h2>
                <h3>{moment(event.startTime).format("DD. MMM YYYY")}</h3>
                <RegistrationModal event={event}/>
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