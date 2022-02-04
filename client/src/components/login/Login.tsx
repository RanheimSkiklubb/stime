import React from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
import Tooltip from "@mui/material/Tooltip";

import {useAuthState} from 'react-firebase-hooks/auth';
import Firebase from '../Firebase';
import { getAuth } from 'firebase/auth';
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles({
        root: {
            flexGrow: 1,
        },
        login: {
            float: 'right',
        },
        avatar: {
            width: 32,
            height: 32,
        },
    });

const Login: React.FC = () => {
    const classes = useStyles();
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
                <p>Error: {error}</p>
            </div>);
    }
    if (user) {
        const alt: string = user.displayName ? user.displayName : 'Unknown';
        const src: string = user.photoURL ? user.photoURL : 'broken';
        return (
            <div className={classes.login} onClick={Firebase.logout}>
                <Tooltip title="Click to log out" aria-label="logout">
                    <Avatar alt={alt} src={src} className={classes.avatar}/>
                </Tooltip>
            </div>);
    }
    return (
        <div className={classes.login} onClick={Firebase.login}>
            <Tooltip title="Click to log in" aria-label="login">
                <AccountCircle />
            </Tooltip>
        </div>
    );
};

export default Login;
