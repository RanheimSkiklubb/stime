import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

import './App.css';
import EventListPage from './event-list-page/EventListPage'
import EventPage from './event-page/EventPage'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App: React.FC = () => {

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                <Router>
                    <Switch>
                        <Route path="/event/:eventId" component={(props:any) => <EventPage {...props} />} />
                        <Route path="/">
                            <EventListPage/>
                        </Route>
                    </Switch>
                </Router>
            </Container>
        </React.Fragment>
    );
}

export default App;
