import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import '../App.css';
import Table from 'react-bootstrap/Table';
import moment from 'moment';
import Event from '../model/event';
import * as firebase from '../components/Firebase/firebase';

interface State {
    events: Event[]
}

const EventListPage: React.FC = (props) => {
    
    const history = useHistory();
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        (async () => {
           const events = await firebase.fetchEvents()
           setEvents(events)})();
      }, []);
 
    return (
        <div>
            <h1>Arrangement</h1><br/>
            <Table hover>
                <thead>
                    <tr>
                        <th scope="row">Dato</th>
                        <th scope="row">Arrangement</th>
                        <th scope="row">Øvelse</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => 
                        <tr key={event.id} onClick={() => history.push(`/event/${event.id}`)}>
                            <td>{moment(event.startTime).format("DD. MMM YYYY")}</td><td>{event.name}</td><td>{event.eventType}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );

}

export default EventListPage;