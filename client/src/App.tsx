import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EventListPage from './EventListPage'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams
  } from "react-router-dom";

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
                                <EventListPage/>
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
