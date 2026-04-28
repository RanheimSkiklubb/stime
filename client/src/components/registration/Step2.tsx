import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Event from '../../model/event';
import Participant from '../../model/participant';
import RegisteredParticipant from './RegisteredParticipant';

interface Props {
    event: Event,
    participant: Participant,
    email: string,
    phone: string,
    editCallback: () => void,
    registerCallback: () => void
}

// Dice's coefficient on character bigrams. Returns a similarity score in [0, 1].
const compareTwoStrings = (a: string, b: string): number => {
    if (a === b) return 1;
    if (a.length < 2 || b.length < 2) return 0;

    const bigrams = (s: string) => {
        const map = new Map<string, number>();
        for (let i = 0; i < s.length - 1; i++) {
            const bg = s.substring(i, i + 2);
            map.set(bg, (map.get(bg) || 0) + 1);
        }
        return map;
    };

    const aBigrams = bigrams(a);
    const bBigrams = bigrams(b);
    let intersection = 0;
    aBigrams.forEach((count, bg) => {
        const bCount = bBigrams.get(bg);
        if (bCount) intersection += Math.min(count, bCount);
    });
    return (2 * intersection) / (a.length + b.length - 2);
};

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
    const similar = lookForSimilarRegistrations(props.participant, props.event);
    let similarNotification = null;
    if (similar) {
        similarNotification = (
            <>
                <Alert style={{marginTop: '10px', marginBottom: '10px', paddingTop: '0', paddingBottom: '0'}}
                    severity="warning">Det finnes allerede en liknende påmelding</Alert>
                <RegisteredParticipant participant={similar} email="***@***.***" phone="********" sx={{ '& td': { color: 'grey' } }}/>
            </>
        )
    }
    return (
        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Steg 2 av 2: Bekreft påmelding</p>
            <RegisteredParticipant participant={props.participant} email={props.email} phone={props.phone}/>
            {similarNotification}
            <Grid container style={{marginTop: '20px', marginBottom: '20px'}}>
                <Grid size={6}><Button variant="contained" color="primary" onClick={props.editCallback}>Endre</Button></Grid>
                <Grid size={6} style={{textAlign: 'right'}}><Button variant="contained" color="primary" className="float-right" onClick={props.registerCallback}>Meld på</Button></Grid>
            </Grid>
        </Stack>
    );
}

export default Step2;
