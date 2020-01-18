import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import EventListPage from './event-list-page/EventListPage'
import EventPage from './event-page/EventPage'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const useStyles = makeStyles({
    container: {
      textAlign: "center"
    },
});

const App: React.FC = () => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg" className={classes.container}>
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
