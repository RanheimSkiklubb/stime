import React from 'react';
import Grid from '@material-ui/core/Grid';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {createStyles} from "@material-ui/styles";
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

interface Props {
    startNumber: number,
    restartCallback: () => void
}

const NoLongerAvailable: React.FC<Props> = (props: Props) => {

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            emphasize: {
                fontWeight: 'bold',
                color: theme.palette.error.main
            },
        }
    ));
    const classes = useStyles({});

    return (
        <Grid container direction="column" justify="center" alignItems="center">
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