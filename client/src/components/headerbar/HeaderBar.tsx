import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Login from "../login/Login";
import AppBar from "@mui/material/AppBar";
import {useEffect, useState} from "react";
import {ListItemIcon, Menu, MenuItem} from "@mui/material";
import {Theme} from "@mui/material/styles";
import {makeStyles} from "@mui/styles";
import {Create, Home} from "@mui/icons-material";
import {useHistory} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import {getAuth} from "firebase/auth";

interface Props {
    heading: string
}

const useStyles = makeStyles((theme: Theme) => ({
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

const HeaderBar = (props: Props) => {
    const classes = useStyles();

    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [admin, setAdmin] = useState<boolean>(false);
    const [user] = useAuthState(getAuth());

    useEffect(() => {
        const fetchClaims = async () => {
            const idTokenResult =  await user?.getIdTokenResult(true);
            const admin: boolean = idTokenResult ? idTokenResult.claims.admin as unknown as boolean : false;
            setAdmin(admin === true);
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
                        onClick={handleClick}
                        size="large">
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
        </div>
    );
};

export default HeaderBar;
