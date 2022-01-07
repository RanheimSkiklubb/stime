import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

interface Props {
    registerMoreCallback: () => void,
    closeCallback: () => void
}

const Step3: React.FC<Props> = (props: Props) => {

    return (
        <Grid>
            <div style={{textAlign: 'center', fontWeight: 'bold'}}>
                <p>Din påmelding er registrert!</p>
            </div>
            <Grid container style={{margin: '40px 8px 20px 8px'}}>
                <Grid item xs={6}>
                    <Button variant="contained" color="primary" onClick={props.closeCallback}>Lukk</Button>
                </Grid>
                <Grid item xs={6} style={{textAlign: 'right'}}><Button className="float-right" variant="contained" color="primary" onClick={props.registerMoreCallback}>Meld på flere</Button></Grid>
            </Grid>
        </Grid>
    )
}

export default Step3;