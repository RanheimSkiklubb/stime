import React from 'react';
import Grid from '@mui/material/Grid';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface Props {
    startNumber: number,
    restartCallback: () => void
}

const NoLongerAvailable: React.FC<Props> = (props: Props) => {

    const useStyles = makeStyles((theme: Theme) => ({
            emphasize: {
                fontWeight: 'bold',
                color: theme.palette.error.main
            },
        }
    ));
    const classes = useStyles();

    return (
        <Grid container direction="column" justifyContent="center" alignItems="center">
            <Grid item xs={12}>
                <p className={classes.emphasize}>Startnummer {props.startNumber} er ikke lenger tilgjengelig.</p>
            </Grid>

            <Grid item xs={12}>
                <Box m={2}>
                    <Button variant="contained" color="primary" onClick={props.restartCallback}>Start på nytt</Button>
                </Box>
            </Grid>
        </Grid>
    );
}

export default NoLongerAvailable;
