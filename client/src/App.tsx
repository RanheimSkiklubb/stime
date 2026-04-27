import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import {makeStyles} from '@mui/styles';
import EventListPage from './components/event-list-page/EventListPage';
import EventPage from './components/EventPage';
import AdminPage from './components/AdminPage';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import LateRegistrationPage from './components/LateRegistrationPage';

const useStyles = makeStyles({
    container: {
      textAlign: "center"
    },
});

const App = () => {
    const classes = useStyles();
    return (
        <>
            <CssBaseline />
            <Container maxWidth="lg" className={classes.container}>
                <Router>
                    <Routes>
                        <Route path="/event/:eventId/late-registration" element={<LateRegistrationPage />} />
                        <Route path="/event/:eventId/*" element={<EventPage />} />
                        <Route path="/admin/:eventId/*" element={<AdminPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/" element={<EventListPage />} />
                    </Routes>
                </Router>
            </Container>
        </>
    );
};

export default App;
