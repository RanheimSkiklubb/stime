import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { makeStyles } from '@mui/styles';
import EventListPage from './components/event-list-page/EventListPage';
import EventPage from './components/EventPage';
import AdminPage from './components/AdminPage';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LateRegistrationPage from './components/LateRegistrationPage';

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
                        <Route path="/event/:eventId/late-registration" component={(props:any) => <LateRegistrationPage {...props} />} />
                        <Route path="/event/:eventId" render={(history) => (<EventPage pathname={history.location.pathname}/>)} />
                        <Route path="/admin/:eventId" render={(history) => (<AdminPage pathname={history.location.pathname}/>)} />
                        <Route path="/admin/" component={(props:any) => <AdminPage {...props} />} />
                        <Route path="/" >
                            <EventListPage/>
                        </Route>
                    </Switch>
                </Router>
            </Container>
        </React.Fragment>
    );
};

export default App;
