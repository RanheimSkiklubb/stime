import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Login from "../login/Login";
import AppBar from "@material-ui/core/AppBar";
import React, {useEffect, useState} from "react";
import {ListItemIcon, Menu, MenuItem} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/styles";
import {Home, Create} from "@material-ui/icons";
import {useHistory} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import firebase from "firebase";

interface Props {
    heading: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    appBar: {
        marginBottom: theme.spacing(1),
    }
}));

const HeaderBar: React.FC<Props> = (props: Props) => {
    const classes = useStyles({});

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
        <div className={classes.root}>
            <AppBar position="sticky" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu-icon"
                        aria-controls="menu"
                        aria-haspopup="true"
                        onClick={handleClick}>
                        <MenuIcon/>
                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={goHome}>
                            <ListItemIcon>
                                <Home />
                            </ListItemIcon>
                            Home
                        </MenuItem>
                        {admin ?
                            <MenuItem onClick={newEvent}>
                                <ListItemIcon>
                                    <Create />
                                </ListItemIcon>
                                Create event
                            </MenuItem>
                            :
                            <div></div>}
                    </Menu>
                    <Typography variant="h5" className={classes.title}>
                        {props.heading}
                    </Typography>
                    <Login/>
                </Toolbar>
            </AppBar>
        </div>);
};

export default HeaderBar;
