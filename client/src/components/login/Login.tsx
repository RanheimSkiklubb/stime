import React from "react";
import IconButton from "@material-ui/core/Button";
import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';

import {useAuthState} from "react-firebase-hooks/auth";
import Firebase from "../Firebase";
import firebase from "firebase";
import {ListItemAvatar} from "@material-ui/core";

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
                <Avatar alt={alt} src={src} style={{width: 32, height: 32}}/>
            </div>);
    }
    return (<div style={{float: 'right'}} onClick={Firebase.login}><AccountCircle /></div>);
};

export default Login;
