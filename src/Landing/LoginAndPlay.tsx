import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import { useAuth } from "../Auth/UserAuthContext";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import LogoutIcon from "@mui/icons-material/Logout";

import Avatar, { genConfig } from "react-nice-avatar";

export default function LoginAndPlay() {
    const [username, setUsername] = useState<string>("");
    const [usernameError, setUsernameError] = useState("");
    const { user, logout, registerWithSecretKey } = useAuth();
    const [openDialog, setOpenDialog] = useState(false);
    const [avatarSeed, setAvatarSeed] = useState(
        user != undefined ? user.userAvatarSeed : "" + Date()
    );

    // TODO : for dev purposes
    const [accessKey, setAccessKey] = useState("");
    const [accessKeyError, setAccessKeyError] = useState("");
    const [loading, setLoading] = useState(false);
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

        setUsernameError("");
        return true;
    };

    const isSecretKeyValid = () => {
        if (accessKey.length <= 0) {
            setAccessKeyError("Secret key can't be empty");
            return false;
        }

        if (accessKey.length >= 100) {
            setAccessKeyError(
                "Secret key can't be longer than 100 characters."
            );
            return false;
        }

        setAccessKeyError("");
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

        if (!isSecretKeyValid()) return;

        setLoading(true);

        registerWithSecretKey(uuid(), username, avatarSeed, accessKey).then(
            (success) => {
                if (success) {
                    navigate("/dashboard");
                } else {
                    setLoading(false);
                    setAccessKeyError("This access key is not valid.");
                }
            }
        );
    };

    const handleLogout = () => {
        logout();
    };

    if (!user) {
        return (
            <Box>
                <Typography sx={{ pb: 3 }}>
                    Choose avatar and username
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

                    <Box>
                        <TextField
                            label="Username"
                            variant="outlined"
                            error={usernameError != ""}
                            helperText={usernameError}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        {/* TODO : only for dev purposes */}
                        <TextField
                            label="Access key"
                            variant="outlined"
                            error={accessKeyError != ""}
                            helperText={accessKeyError}
                            value={accessKey}
                            onChange={(e) => setAccessKey(e.target.value)}
                            sx={{ mt: 2 }}
                        />
                    </Box>
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Box
                        sx={{
                            position: "relative",
                            width: "fit-content",
                            ml: "auto",
                        }}
                    >
                        <Button
                            onClick={handleStartGame}
                            variant="outlined"
                            disabled={loading}
                        >
                            Play as guest
                        </Button>

                        {loading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    marginTop: "-12px",
                                    marginLeft: "-12px",
                                }}
                            />
                        )}
                    </Box>
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
                    onClick={() => setOpenDialog(true)}
                    variant="outlined"
                    sx={{ ml: 2 }}
                >
                    <LogoutIcon />
                </Button>
            </Box>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth={"xs"}
                fullWidth={true}
            >
                <DialogTitle id="alert-dialog-title">{"Logout?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This will erase your username, avatar and access key
                        from storage.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogout}>Log out</Button>
                    <Button
                        variant="contained"
                        autoFocus
                        onClick={() => setOpenDialog(false)}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
