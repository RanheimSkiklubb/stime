import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface Props {
    startNumber: number,
    restartCallback: () => void
}

const NoLongerAvailable = (props: Props) => {
    return (
        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <Box component="p" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                Startnummer {props.startNumber} er ikke lenger tilgjengelig.
            </Box>
            <Box sx={{ m: 2 }}>
                <Button variant="contained" color="primary" onClick={props.restartCallback}>Start på nytt</Button>
            </Box>
        </Stack>
    );
}

export default NoLongerAvailable;
