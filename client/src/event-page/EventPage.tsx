import React, { useState, useEffect } from 'react';
import './EventPage.css';
import Event from '../model/event';
import EventClass from '../model/eventClass';
import { match } from "react-router-dom";
import moment from 'moment';
import Table from 'react-bootstrap/Table';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import RegistrationModal from './RegistrationModal';
import ParticipantList from './ParticipantList';
import Club from '../model/club';

interface MatchParams {
    eventId: string
}

interface Props {
    match: match<MatchParams>
}

const fetchEvent = async (eventId: string):Promise<Event> => {
    const eventBody = await fetch(`http://localhost:3001/api/event/${eventId}`)
    const eventObj = await eventBody.json();
    return Promise.resolve({
        id: eventObj.id, 
        name: eventObj.name,
        eventType: eventObj.eventType,
        description: eventObj.description,
        startTime: eventObj.startTime, 
        registrationStart: eventObj.registrationStart, 
        registrationEnd: eventObj.registrationEnd, 
        eventClasses: eventObj.eventClasses, 
        participants: eventObj.participants
    });
}

const EventPage: React.FC<Props> = (props: Props) => {

    const [event, setEvents] = useState<Event>({id: "", name: "", description: "", eventType: "", startTime: new Date(), registrationStart: new Date(), registrationEnd: new Date(), eventClasses:[], participants: []});
    const [clubs, setClubs] = useState<Club[]>([]);

    const loadEvent = async () => {
        const eventId = props.match.params.eventId;
        const event = await fetchEvent(eventId);
        setEvents(event);
    }

    useEffect(() => {
        const fecthEvents = async () => {
            const eventId = props.match.params.eventId;
            const event = await fetchEvent(eventId);
            setEvents(event);
        }
        fecthEvents();
    }, [props.match]);

    useEffect(() => {
        const fecthEvents = async () => {
            const clubsBody = await fetch('http://localhost:3001/api/club')
            const clubsData = await clubsBody.json();
            setClubs(clubsData)
        }
        fecthEvents();
    }, []);

    const infoTab = (
        <div className="infoContainer">
            <CardGroup>
                <Card>
                    <Card.Body>
                        <Table className="eventInfo" style={{marginBottom: 0}}>    
                            <tbody>
                                <tr><td>Dato:</td><td>{moment(event.startTime).format("DD. MMM YYYY")}</td></tr>
                                <tr><td>Arrangement:</td><td>{event.description}</td></tr>
                                <tr><td>Øvelse:</td><td>{event.eventType}</td></tr>
                                <tr><td>Første start:</td><td>{moment(event.startTime).format("HH:mm")}</td></tr>
                                <tr><td>Påmeldingsfrist:</td><td>{moment(event.registrationEnd).format("DD. MMM YYYY HH:mm")}</td></tr>
                                <tr><td>Informasjon:</td><td>{event.description}</td></tr>
                            </tbody>
                        </Table>                 
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body>
                        <Table striped bordered size="sm" style={{marginBottom: 0}}>
                            <thead>
                                <tr>
                                    <th>Klasse</th>
                                    <th>Løype</th>
                                </tr>
                            </thead>
                            <tbody>
                                {event.eventClasses.map((ec:EventClass, idx:number) => 
                                <tr key={idx}>
                                    <td>{ec.name}</td>
                                    <td>{ec.course}</td>
                                </tr>)}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </CardGroup>
            <RegistrationModal event={event} clubs={clubs} loadEventCallback={loadEvent}/>  
        </div>
    );

    return (
        <div>
            <h2>{event.name}</h2>
                <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
                <Tab eventKey="home" title="Informasjon">
                    {infoTab}
                </Tab>
                <Tab eventKey="profile" title={`Deltakerliste (${event.participants.length})`}>
                    <ParticipantList event={event}/>
                </Tab>
            </Tabs>
        </div>
    );
    
}

export default EventPage;