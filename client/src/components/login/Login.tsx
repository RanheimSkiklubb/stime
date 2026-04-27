import AccountCircle from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

import {useAuthState} from 'react-firebase-hooks/auth';
import Firebase from '../Firebase';
import {getAuth} from 'firebase/auth';

const Login = () => {
    const [user, initializing, error] = useAuthState(getAuth());

    if (initializing) {
        return (
            <div>
                <p>Initialising User...</p>
            </div>);
    }
    if (error) {
        return (
            <div>
                <p>Error: {error.message}</p>
            </div>);
    }
    if (user) {
        const alt: string = user.displayName ? user.displayName : 'Unknown';
        const src: string = user.photoURL ? user.photoURL : 'broken';
        return (
            <Box sx={{ float: 'right' }} onClick={Firebase.logout}>
                <Tooltip title="Click to log out" aria-label="logout">
                    <Avatar alt={alt} src={src} sx={{ width: 32, height: 32 }}/>
                </Tooltip>
            </Box>);
    }
    return (
        <Box sx={{ float: 'right' }} onClick={Firebase.login}>
            <Tooltip title="Click to log in" aria-label="login">
                <AccountCircle />
            </Tooltip>
        </Box>
    );
};

export default Login;
