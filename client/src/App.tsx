import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import moment from 'moment';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams
  } from "react-router-dom";

interface Event {
    id: string;
    name: string;
    startTime: Date;
    participants: string[];
}

interface Props {
    events: Event[]
}

const Event: React.FC = () => {
    let { eventId } = useParams();
    return (
        <div>
            <h1>Event {eventId}</h1><br/>
        </div>
    );
}

const EventList: React.FC<Props> = ({events}: Props) => {
    
    const createList = () => events.map(event => 
    <ListGroup.Item action href={`/event/${event.id}`}>{moment(event.startTime).format("DD. MMM YYYY")}: {event.name}</ListGroup.Item>
        );

    return (
        <div>
            <h1>Arrangement</h1><br/>
            <ListGroup>
                {events ? createList() : ""}
            </ListGroup>
        </div>
    );
}



class App extends React.Component<{}, Props> {

    constructor(props: Props) {
        super(props);
        this.state = {events: props.events};
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
        return (
            <Container fluid={true}>
                <Row>
                    <Col></Col>
                    <Col className="text-center" xs={9}>
                        <Router>
                            <Switch>
                            <Route path="/event/:eventId">
                                <Event />
                            </Route>
                            <Route path="/">
                                <EventList events={this.state.events}/>
                            </Route>
                            </Switch>
                        </Router>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        );
    }
}

export default App;
