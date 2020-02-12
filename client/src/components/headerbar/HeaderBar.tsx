import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Login from "../login/Login";
import AppBar from "@material-ui/core/AppBar";
import React, {useEffect, useState} from "react";
import {Menu, MenuItem} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import firebase from "firebase";

interface Props {
    heading: string
}

const HeaderBar: React.FC<Props> = (props: Props) => {
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [admin, setAdmin] = useState<boolean>(false);
    const [user] = useAuthState(firebase.auth());

    useEffect(() => {
        const fetchClaims = async () => {
            const idTokenResult =  await user?.getIdTokenResult(true);
            setAdmin(idTokenResult?.claims.admin);
        };
        if (user) fetchClaims();
    }, [user, setAdmin])

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const goHome = () => {
        handleClose();
        history.push("/");
    };

    const newEvent = () => {
        handleClose();
        history.push("/admin/");
    };

    return (
        <AppBar position="sticky" style={{marginBottom: 10}}>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu-icon" aria-controls="menu" aria-haspopup="true" onClick={handleClick}>
                    <MenuIcon/>
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={goHome}>Home</MenuItem>
                    {admin ? <MenuItem onClick={newEvent}>Create event</MenuItem> : <div></div>}
                </Menu>
                <Typography variant="h5" style={{flexGrow: 1}}>
                    {props.heading}
                </Typography>
                <Login/>
            </Toolbar>
        </AppBar>);
};

export default HeaderBar;
