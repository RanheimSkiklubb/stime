import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import EventListPage from './components/event-list-page/EventListPage';
import EventPage from './components/EventPage';
import AdminPage from './components/AdminPage';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const useStyles = makeStyles({
    container: {
      textAlign: "center"
    },
});

const App: React.FC = () => {
    const classes = useStyles({});
    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg" className={classes.container}>
                <Router>
                    <Switch>
                        <Route path="/event/:eventId" component={(props:any) => <EventPage {...props} />} />
                        <Route path="/admin/:eventId" component={(props:any) => <AdminPage {...props} />} />
                        <Route path="/admin/" component={(props:any) => <AdminPage {...props} />} />
                        <Route path="/">
                            <EventListPage/>
                        </Route>
                    </Switch>
                </Router>
            </Container>
        </React.Fragment>
    );
};

export default App;
