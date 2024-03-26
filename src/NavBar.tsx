import {
  AppBar,
  Box,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./Auth/UserAuthContext";
import Avatar, { genConfig } from "react-nice-avatar";

const AvatarOrLogin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <MenuItem onClick={() => navigate("/")}>
        <Typography textAlign="center">Sign in</Typography>
      </MenuItem>
    );
  }

  const config = genConfig(user.userAvatarSeed);

  if (user) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          pb: 1,
        }}
      >
        <>
          <Box sx={{ ml: 1, mr: 1 }}>
            <Avatar
              style={{
                width: "2rem",
                height: "2rem",
              }}
              {...config}
            />
          </Box>
          <Box sx={{ maxWidth: 90 }}>
            <Typography noWrap>{user && user.username}</Typography>
          </Box>
        </>
      </Box>
    );
  }
};

export default function NavBar() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();

  const settings = ["Home", "Play", "About"];

  const handleOpenUserMenu = (event: any) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // TODO : just do lower case setting and use in navigate
  const handleNavigationButtonClick = (_setting: string) => {
    if (_setting == "Home") {
      navigate("/");
    }

    if (_setting == "Play") {
      navigate("/dashboard");
    }

    if (_setting == "About") {
      navigate("/about");
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
            <AvatarOrLogin />
            <Divider sx={{ width: 200 }} />

            {settings.map((setting) => (
              <MenuItem
                key={setting}
                onClick={() => handleNavigationButtonClick(setting)}
              >
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
            {/* <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <ThemeModeSelector />
                        </Box> */}
          </Menu>
        </Box>
      </Container>
    </AppBar>
  );
}
