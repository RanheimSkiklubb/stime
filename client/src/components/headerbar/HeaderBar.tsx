import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Login from "../login/Login";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";
import {ListItemIcon, Menu, MenuItem} from "@mui/material";
import {Create, Home} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import {getAuth} from "firebase/auth";

interface Props {
    heading: string
}

const HeaderBar = (props: Props) => {
    const navigate = useNavigate();
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
        navigate("/");
    };

    const newEvent = () => {
        handleClose();
        navigate("/admin/");
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="sticky" sx={{ mb: 1 }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        sx={{ mr: 2 }}
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
                    <Typography variant="h5" sx={{ flexGrow: 1 }}>
                        {props.heading}
                    </Typography>
                    <Login/>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default HeaderBar;
