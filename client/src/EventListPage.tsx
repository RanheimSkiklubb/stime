import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import './App.css';
import Table from 'react-bootstrap/Table';
import moment from 'moment';
import Event from './model/event';


interface State {
    events: Event[]
}

const EventListPage: React.FC = () => {
    
    const history = useHistory();
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fecthEvents = () => {
            fetch('http://localhost:3001/api/event')
            .then(res => res.json())
            .then((data) => setEvents(data))
        }
        fecthEvents();
      }, []);
 
    return (
        <div>
            <h1>Arrangement</h1><br/>
            <Table hover>
                <thead>
                    <tr>
                        <th>Dato</th>
                        <th>Arrangement</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => 
                        <tr key={event.id}>
                            <td onClick={() => history.push(`/event/${event.id}`)}>{moment(event.startTime).format("DD. MMM YYYY")}</td><td>{event.name}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );

}

export default EventListPage;