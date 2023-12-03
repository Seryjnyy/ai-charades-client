import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/UserAuthContext";
import LobbyUsers from "./LobbyUsers";
import SocketContext, { useWebSocket } from "./SocketContext";
import LobbyTopics from "./LobbyTopics";
import LobbySettings from "./LobbySettings";
import LobbyStartGame from "./LobbyStartGame";
import { useState } from "react";
import {
    Alert,
    AlertColor,
    Box,
    Button,
    Paper,
    Skeleton,
    Snackbar,
    Typography,
} from "@mui/material";
import GamePrompting from "./GamePrompting";
import GameGuessing from "./GameGuessing";
import Results from "./Results";

const Lobby = ({
    useSnackbar,
}: {
    useSnackbar: (severity: AlertColor, message: string) => void;
}) => {
    const { roomstate } = useWebSocket();

    if (roomstate == undefined) {
        return <div>something went wrong in lobby</div>;
    }

    return (
        <div>
            <LobbyUsers />
            <LobbyTopics />
            <LobbySettings />
            <LobbyStartGame useSnackbar={useSnackbar} />
        </div>
    );
};

const Game = () => {
    const { roomstate } = useWebSocket();

    if (roomstate == undefined) {
        return <div>no roomstate</div>;
    }

    if (roomstate.gameState.round == "PROMPTING") {
        return (
            <div>
                <GamePrompting />
            </div>
        );
    }

    if (roomstate.gameState.round == "GUESSING") {
        return (
            <div>
                <GameGuessing />
            </div>
        );
    }
};

const Some = ({
    useSnackbar,
}: {
    useSnackbar: (severity: AlertColor, message: string) => void;
}) => {
    const { roomstate, socketConnected, connectionError } = useWebSocket();
    console.log(roomstate);
    console.log(socketConnected);
    const nagivate = useNavigate();

    if (connectionError != "") {
        return (
            <Paper sx={{ maxWidth: 400, mt: 2, mx: "auto", height: 600 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                    }}
                >
                    {connectionError}
                    <Button onClick={() => nagivate("/dashboard")}>
                        go back
                    </Button>
                </Box>
            </Paper>
        );
    }

    // First connection
    if (!socketConnected && roomstate == undefined) {
        return (
            <Paper sx={{ maxWidth: 400, mt: 2, mx: "auto", height: 600 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                    }}
                >
                    Connecting socket...
                </Box>
            </Paper>
        );
    }

    // Lost socket connection during
    if (!socketConnected && roomstate != undefined) {
        return (
            <Paper sx={{ maxWidth: 400, mt: 2, mx: "auto", height: 600 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                    }}
                >
                    <Typography>Lost connection to server, sorry :/</Typography>
                    <Button onClick={() => nagivate("/dashboard")}>
                        go back
                    </Button>
                </Box>
            </Paper>
        );
    }

    // Waiting for first data
    if (socketConnected && roomstate == undefined) {
        return (
            <div>
                <Skeleton
                    variant={"rounded"}
                    sx={{ maxWidth: 400, mt: 2, mx: "auto", height: 600 }}
                />
            </div>
        );
    }

    // If Socket connected and got data from server then continue

    if (roomstate == undefined) {
        return <div>no roomstate</div>;
    }

    if (roomstate.state == "LOBBY") {
        return (
            <div>
                <Box sx={{ mx: "auto", maxWidth: 400, mt: 2 }}>
                    <Lobby useSnackbar={useSnackbar} />
                </Box>
            </div>
        );
    }

    if (roomstate.state == "GAME") {
        return (
            <div>
                <Game />
            </div>
        );
    }

    if (roomstate.state == "RESULTS") {
        return (
            <div>
                <Results />
            </div>
        );
    }

    if (roomstate.state == "ERROR") {
        return <div>error, sorry can't continue.</div>;
    }

    return <div>default, something went wrong</div>;
};

// TODO : throw error for error boundary if roomID not present
export default function GameRoom2() {
    const { user } = useAuth();
    const { state } = useLocation();
    const [snackbarOpen, setSnackbarOpen] = useState<{
        open: boolean;
        severity: AlertColor;
        message: string;
    }>({
        open: false,
        severity: "info",
        message: "",
    });

    if (!state) {
        return <div>no state provided</div>;
    }

    if (!state.roomID) {
        return <div> no roomID in state</div>;
    }

    if (!user) {
        return <div>user doesn't exist</div>;
    }

    const { roomID } = state;
    console.log(roomID);

    const handleClose = (
        _event: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }

        setSnackbarOpen({ open: false, message: "", severity: "info" });
    };

    const useSnackbar = (severity: AlertColor, message: string) => {
        setSnackbarOpen({ open: true, severity: severity, message: message });
    };

    return (
        <SocketContext
            roomID={roomID}
            userID={user.userID}
            userAvatarSeed={user.userAvatarSeed}
            accessKey={user.accessKey}
        >
            <Some useSnackbar={useSnackbar} />

            <Snackbar
                open={snackbarOpen.open}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity={snackbarOpen.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbarOpen.message}
                </Alert>
            </Snackbar>
        </SocketContext>
    );
}
