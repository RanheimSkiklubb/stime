import React from 'react';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from "@material-ui/core/Tooltip";

import {useAuthState} from 'react-firebase-hooks/auth';
import Firebase from '../Firebase';
import firebase from 'firebase';

const Login: React.FC = () => {
    const [user, initializing, error] = useAuthState(firebase.auth());

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
            <div style={{float: 'right'}} onClick={Firebase.logout}>
                <Tooltip title={alt} aria-label="avatar">
                    <Avatar alt={alt} src={src} style={{width: 32, height: 32}}/>
                </Tooltip>
            </div>);
    }
    return (
        <div style={{float: 'right'}} onClick={Firebase.login}>
            <Tooltip title="Click to log in" aria-label="login">
                <AccountCircle />
            </Tooltip>
        </div>
    );
};

export default Login;
