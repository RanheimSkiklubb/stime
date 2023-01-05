import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import {Theme} from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import Event from '../../model/event';
import Participant from '../../model/participant';
import RegisteredParticipant from './RegisteredParticipant';
import {compareTwoStrings} from 'string-similarity';

interface Props {
    event: Event,
    participant: Participant,
    email: string,
    phone: string,
    editCallback: () => void,
    registerCallback: () => void
}

const lookForSimilarRegistrations = (p: Participant, e: Event): Participant|null => {
    if (!e) return null;
    const generateKey = (p: Participant) => `${p.firstName}${p.lastName}${p.club}`;
    const key = generateKey(p);
    const similarities = e.participants.map((p: Participant) => {
        return {
            participant: p,
            similarity: compareTwoStrings(key, generateKey(p))
        }
    });
    const mostSimilar = similarities.reduce((p, c) => p.similarity > c.similarity ? p : c, {similarity: -1, participant: p});
    if (mostSimilar.similarity > 0.9) {
        return mostSimilar.participant;
    }
    return null;
};


const Step2 = (props: Props) => {

    const useStyles = makeStyles((theme: Theme) => ({
        similar: {
            '& td': {
                color: "grey"
            }
        },
        emphasize: {
            fontWeight: 'bold',
        },
    }));
    const classes = useStyles();
    const similar = lookForSimilarRegistrations(props.participant, props.event);
    let similarNotification = null;
    if (similar) {
        similarNotification = (
            <>
                <Grid item xs={12}>
                    <Alert style={{marginTop: '10px', marginBottom: '10px', paddingTop: '0', paddingBottom: '0'}}
                        severity="warning">Det finnes allerede en liknende påmelding</Alert>
                </Grid>
                <Grid item xs={12}>
                    <RegisteredParticipant participant={similar} email="***@***.***" phone="********" className={classes.similar}/>
                </Grid>
            </>
        )
    }
    return (
        <Grid container direction="column" justifyContent="center" alignItems="center">
            <Grid item xs={12} style={{textAlign: 'center'}}>
                <p className={classes.emphasize}>Steg 2 av 2: Bekreft påmelding</p>
            </Grid>
            <Grid item xs={12}>
                <RegisteredParticipant participant={props.participant} email={props.email} phone={props.phone}/>
            </Grid>
            {similarNotification}
            <Grid container style={{marginTop: '20px', marginBottom: '20px'}}>
                <Grid item xs={6}><Button variant="contained" color="primary" onClick={props.editCallback}>Endre</Button></Grid>
                <Grid item xs={6} style={{textAlign: 'right'}}><Button variant="contained" color="primary" className="float-right" onClick={props.registerCallback}>Meld på</Button></Grid>
            </Grid>
        </Grid>
    );
}

export default Step2;
