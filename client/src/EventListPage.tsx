import React from 'react';
import './App.css';
import ListGroup from 'react-bootstrap/ListGroup';
import moment from 'moment';
import Event from './Event';

interface State {
    events: Event[]
}

export default class EventListPage extends React.Component<{}, State> {
    
    constructor(props: any) {
        super(props);
        this.state = {events: []};
    }

    componentDidMount() {
        fetch('http://localhost:3000/api/event')
        .then(res => res.json())
        .then((data) => {
          this.setState({ events: data })
        })
        .catch(console.log)
    }

    render() {
        const createList = () => this.state.events.map(event => 
            <ListGroup.Item action href={`/event/${event.id}`} key={event.id}>{moment(event.startTime).format("DD. MMM YYYY")}: {event.name}</ListGroup.Item>
                );
        
            return (
                <div>
                    <h1>Arrangement</h1><br/>
                    <ListGroup>
                        {createList()}
                    </ListGroup>
                </div>
            );
    }

}