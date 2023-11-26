import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import { useAuth } from "../Auth/UserAuthContext";
import { Box, Button, TextField, Typography } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import LogoutIcon from "@mui/icons-material/Logout";

import Avatar, { genConfig } from "react-nice-avatar";

export default function LoginAndPlay() {
    const [username, setUsername] = useState<string>("");
    const [usernameError, setUsernameError] = useState("");
    const { user, register, logout, registerWithSecretKey } = useAuth();
    const [avatarSeed, setAvatarSeed] = useState(
        user != undefined ? user.userAvatarSeed : "" + Date()
    );

    // TODO : for dev purposes
    const [secretKey, setSecretKey] = useState("");
    let navigate = useNavigate();
    const config = genConfig(avatarSeed);

    useEffect(() => {
        if (user) {
            setAvatarSeed(user.userAvatarSeed);
        }
    }, [user]);

    const isUsernameValid = () => {
        if (username == "") {
            setUsernameError("Can't have a empty username.");
            return false;
        }

        if (/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(username)) {
            setUsernameError("Can't have special characters.");
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

    const randomAvatar = () => {
        setAvatarSeed(uuid());
    };

    const handleStartGame = () => {
        if (user) {
            // TODO : implement, navigate out
            console.log("go to dashboard");
            navigate("/dashboard");
            return;
        }

        if (!isUsernameValid()) return;

        // register(uuid(), username, avatarSeed);
        registerWithSecretKey(uuid(), username, avatarSeed, secretKey).then(
            (success) => {
                if (success) {
                    navigate("/dashboard");
                }
            }
        );
        // I think its fine if its optimistic, if user doesn't set properly then we will
        // just get redirected back to this page
    };

    const handleLogout = () => {
        logout();
    };

    if (!user) {
        return (
            <Box>
                <Typography sx={{ pb: 1 }}>
                    Choose character and name
                </Typography>

                <Box sx={{ display: "flex" }}>
                    <Box
                        sx={{
                            position: "relative",
                            mr: 4,
                            height: "fit-content",
                        }}
                    >
                        <Avatar
                            style={{ width: "4rem", height: "4rem" }}
                            {...config}
                        />
                        <Box
                            sx={{
                                position: "absolute",
                                right: -8,
                                bottom: -8,
                                backgroundColor: "black",
                                borderRadius: 2,
                            }}
                        >
                            <Button
                                sx={{
                                    maxWidth: 30,
                                    maxHeight: 30,
                                    minWidth: 30,
                                    minHeight: 30,
                                    borderRadius: 2,
                                }}
                                onClick={randomAvatar}
                            >
                                <ReplayIcon />
                            </Button>
                        </Box>
                    </Box>

                    <TextField
                        // label="username"
                        variant="outlined"
                        error={usernameError != ""}
                        helperText={usernameError}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    {/* TODO : only for dev purposes */}
                    <TextField
                        variant="outlined"
                        label="secret pass"
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                    />
                </Box>

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
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
