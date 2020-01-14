import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EventListPage from './event-list-page/EventListPage'
import EventPage from './event-page/EventPage'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App: React.FC = () => {

        return (
            <Container fluid={true}>
                <Row>
                    <Col></Col>
                    <Col className="text-center" xs={9}>
                        <Router>
                            <Switch>
                                <Route path="/event/:eventId" component={(props:any) => <EventPage {...props} />} />
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

export default App;
