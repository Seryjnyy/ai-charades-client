import {
    AppBar,
    Box,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import ThemeModeSelector from "./theme/ThemeModeSwitch";
import { useState } from "react";

export default function NavBar() {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const navigate = useNavigate();

    const navigateTo = (destination: string) => {
        navigate("/" + destination);
    };

    const settings = ["Home", "Dashboard"];

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleNavigationButtonClick = (_setting) => {
        if (_setting == "Home") {
            navigate("/");
        }

        if (_setting == "Dashboard") {
            navigate("/dashboard");
        }
    };

    return (
        <AppBar position="static" color="success" elevation={0}>
            <Container
                maxWidth="xl"
                sx={{
                    display: "flex",
                    maxHeight: 20,
                    mt: 3,
                    alignItems: "center",
                }}
            >
                <Box sx={{ flexGrow: 0, marginLeft: "auto" }}>
                    <Tooltip title="Open settings">
                        <IconButton
                            size="large"
                            onClick={handleOpenUserMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: "45px" }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {settings.map((setting) => (
                            <MenuItem
                                key={setting}
                                onClick={() =>
                                    handleNavigationButtonClick(setting)
                                }
                            >
                                <Typography textAlign="center">
                                    {setting}
                                </Typography>
                            </MenuItem>
                        ))}
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <ThemeModeSelector />
                        </Box>
                    </Menu>
                </Box>
            </Container>
        </AppBar>
    );
}
