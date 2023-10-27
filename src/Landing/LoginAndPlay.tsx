import { useState } from "react";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import { useAuth } from "../Auth/UserAuthContext";
import { Box, Button, TextField, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

import Avatar, { genConfig } from "react-nice-avatar";

export default function LoginAndPlay() {
    const [username, setUsername] = useState<string>("");
    const [usernameError, setUsernameError] = useState("");
    const { user, register, logout } = useAuth();

    let navigate = useNavigate();

    const config = genConfig("hi@dapi.to");

    const isUsernameValid = () => {
        if (username == "") {
            setUsernameError("Can't have a empty username.");
            return false;
        }

        if (username.length > 20) {
            setUsernameError(
                "Can't have a username longer than 20 characters."
            );
            return false;
        }

        return true;
    };

    const handleStartGame = () => {
        if (user) {
            // TODO : implement, navigate out
            console.log("go to dashboard");
            navigate("/dashboard");
            return;
        }

        if (!isUsernameValid()) return;

        register(uuid(), username);
        // I think its fine if its optimistic, if user doesn't set properly then we will
        // just get redirected back to this page
        navigate("/dashboard");
    };

    const handleLogout = () => {
        logout();
    };

    if (!user) {
        return (
            <Box>
                <Typography sx={{ pb: 1 }}>Enter a name</Typography>
                <TextField
                    // label="username"
                    variant="outlined"
                    error={usernameError != ""}
                    helperText={usernameError}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <Box sx={{ display: "flex", justifyContent: "end" }}>
                    <Button onClick={handleStartGame} variant="outlined">
                        Play as guest
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar style={{ width: "4rem", height: "4rem" }} {...config} />
                <Typography sx={{ ml: 2 }}>{user?.username}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "end" }}>
                <Button onClick={handleStartGame} variant="outlined">
                    Play as guest
                </Button>
                <Button
                    onClick={handleLogout}
                    variant="outlined"
                    sx={{ ml: 2 }}
                >
                    <LogoutIcon />
                </Button>
            </Box>
        </>
    );
}
