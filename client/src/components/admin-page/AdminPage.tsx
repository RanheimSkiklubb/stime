import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PostAdd from '@material-ui/icons/PostAdd';
import ListAlt from '@material-ui/icons/ListAlt';

import { useHistory } from "react-router-dom";
import moment from 'moment';
import Event from '../../model/event';
import Firebase from '../Firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import {useAuthState} from "react-firebase-hooks/auth";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {makeStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";


interface State {
    events: Event[]
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

const AdminPage: React.FC = (props) => {

    const history = useHistory();
    const classes = useStyles();
    const [user, initializing, error] = useAuthState(firebase.auth());

    const LoginOrUser: React.FC = () => {
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
            return (
                <div style={{float: 'right'}}>
                    Logged in as {user.displayName}
                    <Button color={"inherit"} onClick={Firebase.logout}>Log out</Button>
                </div>);
        }
        return (<Button color={"inherit"} onClick={Firebase.login}>Log in</Button>);
    };

    const AdminFunctions: React.FC = () => {
        if (user) {
            return (
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                    <TableHead></TableHead>
                    <TableBody>
                        <TableRow hover key={"Sett opp nytt renn"} onClick={() => history.push('/admin')}>
                            <TableCell align='center'><PostAdd /></TableCell>
                            <TableCell><h3>Sett opp nytt renn</h3></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align='center'><ListAlt /></TableCell>
                            <TableCell><h3>Lag startliste</h3></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                </TableContainer>
            );
        }
        return (<div>Log in to use the administrative functions.</div>);
    };

    return (
        <React.Fragment>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Administrative functions
                    </Typography>
                    <LoginOrUser />
                </Toolbar>
            </AppBar>
            <p></p>
            <AdminFunctions />
        </React.Fragment>
    );
};

export default AdminPage;