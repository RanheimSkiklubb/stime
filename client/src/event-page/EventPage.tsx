import React from 'react';
import './EventPage.css';
import Event from '../model/event';
import Participant from '../model/participant';
import { match } from "react-router-dom";
import moment from 'moment';
import Table from 'react-bootstrap/Table';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
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
        
        const event = {
            id: eventData.id, 
            name: eventData.name,
            description: eventData.description,
            startTime: eventData.startTime, 
            registrationStart: eventData.registrationStart, 
            registrationEnd: eventData.registrationEnd, 
            eventClasses: eventData.eventClasses, 
            participants: eventData.participants
        };
        this.setState({ event, clubs: clubsData });
        
    }

    render() {
        if (!this.state || !this.state.event) return null;

        const event = this.state.event;
        const infoTab = (
            <div>
                <table className="eventInfo">
                    <tbody>
                        <tr><td>Dato:</td><td>{moment(event.startTime).format("DD. MMM YYYY")}</td></tr>
                        <tr><td>Første start:</td><td>{moment(event.startTime).format("HH:mm")}</td></tr>
                        <tr><td>Påmeldingsfrist:</td><td>{moment(event.registrationEnd).format("DD. MMM YYYY HH:mm")}</td></tr>
                        <tr><td>Beskrivelse:</td><td>{event.description}</td></tr>

                    </tbody>
                </table>

                <hr/>

                <RegistrationModal event={event} clubs={this.state.clubs}/>
                
            </div>
        );

        const participantList = (
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
        );

        return (
            <div>
                <h2>{event.name}</h2>
                    <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
                    <Tab eventKey="home" title="Informasjon">
                        {infoTab}
                    </Tab>
                    <Tab eventKey="profile" title="Deltakerliste">
                        {participantList}
                    </Tab>
                </Tabs>
            </div>
        );
    }
}