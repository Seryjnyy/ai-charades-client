import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    AlertColor,
    Box,
    Button,
    Chip,
    Paper,
    Snackbar,
    Typography,
    useTheme,
} from "@mui/material";

import { useEffect, useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";
import { useLocation, useNavigate } from "react-router-dom";
import { Socket, connect, io } from "socket.io-client";
import { useAuth } from "../Auth/UserAuthContext";
import crownLogo from "../assets/crown.svg";
import Guessing from "./Gameplay/Guessing";
import Prompting from "./Gameplay/Prompting";
import Results from "./Result/Results";

interface RoomSettings {
    maxPlayer: number;
    gameType?: string;
    selectedTopics: string[];
}

export interface OurState {
    topics: string[];
    prompts: string[];
    imageURIsFromPrompts: string[];
    topicPlace: 0;
    promptPlace: 0;
    imagesToGuess: string[];
    guesses: string[];
    guessPlace: number;
}

export interface GameState {
    gameState: { round: string };
    ourState: OurState;
}

interface TopicGroup {
    topic: string;
    itemsInTopic: number;
}

interface RoomState {
    availableTopics: TopicGroup[];
    creator: string;
    settings: RoomSettings;
}

export interface ResultUser {
    userID: string;
    username: string;
    userAvatarSeed: string;
}

export interface Result {
    topic: string;
    prompt: string;
    guess: string;
    imageURI: string;
    guesser: ResultUser;
    prompter: ResultUser;
}

interface RoomUser {
    userID: string;
    username: string;
    userAvatarSeed: string;
}

// TODO :
// 1 kill websocket when navigating out of page
// it closes on refresh, but not when going back for example
// unstable_useBlocker as useBlocker

// TODO :
// can access this route without coming from clicking button on previous page
// i think it should be turned to url parameter route thingy
// better for when sharing the link with some user
// but this not ideal either, people can just guess the url
// https://www.reddit.com/r/reactjs/comments/wtl6sy/creating_invitation_links/
// but for now go for join through groupID
export default function GameRoom() {
    const [connected, setConnected] = useState(false);
    const [users, setUsers] = useState<RoomUser[]>([]);
    const [socket, setSocket] = useState<Socket>();
    const [gameState, setGameState] = useState<GameState>();
    const [results, setResults] = useState<Result[]>();
    const [snackbarOpen, setSnackbarOpen] = useState<{
        open: boolean;
        severity: AlertColor;
        message: string;
    }>({
        open: false,
        severity: "info",
        message: "",
    });
    const [roomState, setRoomState] = useState<RoomState>();
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [error, setError] = useState({ error: false, message: "" });

    const { state } = useLocation();
    const { roomID } = state;

    const { user } = useAuth();

    const navigate = useNavigate();

    const theme = useTheme();

    const handleClose = (
        _event: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }

        setSnackbarOpen({ open: false, message: "", severity: "info" });
    };

    // TODO : not working
    useEffect(() => {
        if (gameState?.gameState.round == "ERROR:A_PLAYER_LEFT") {
            setSnackbarOpen({
                open: true,
                severity: "error",
                message: "Other player disconnected.",
            });
        }
    }, [gameState]);

    useEffect(() => {
        if (!user) {
            console.log(
                "ERROR: Can't start web socket connection because user is undefined."
            );
            return;
        }

        if (socket) return;

        console.log("connecting to ws");

        const _socket = io("ws://localhost:3000", {
            query: {
                userID: user.userID,
                groupID: roomID,
                userAvatarSeed: user.userAvatarSeed,
            },
        });

        setSocket(_socket);

        _socket.on("connect", () => {
            setConnected(true);
            console.log("entered the room");
        });

        _socket.on("user_change", (data) => {
            setUsers(data);
            console.log(data);
        });

        _socket.on("game_start", (data) => {
            console.log(data);
            setGameState(data);
        });

        _socket.on("room:topic_update", (data) => {
            console.log(data);
            setSelectedTopics(data);
        });

        _socket.on("game_state_update", (data) => {
            console.log("GAME STATE  UPDATE");
            console.log(data);
            setGameState(data);
        });

        _socket.on("room_state_update", (data) => {
            console.log("ROOM STATE  UPDATE");
            console.log(data);
            setRoomState(data.roomState);
        });

        _socket.on("results", (data) => {
            console.log(data);
            setResults(data.results);

            console.log("DISCONNECTING FROM SOCKET");
            _socket.disconnect();
        });

        _socket.on("room:warning", (message) => {
            setSnackbarOpen({
                open: true,
                message: message,
                severity: "warning",
            });
        });

        _socket.on("room:error", (message) => {
            setError({ error: true, message: message });

            // no point in setting snackbar, unless its lifted up
            // rn its only in part of the UI
        });

        _socket.on("disconnect", () => {
            console.log("We got disconnected");
            setSnackbarOpen({
                open: true,
                message: "We got disconnected!",
                severity: "error",
            });

            // TODO : Uncomment this!!!!
            // setError({
            //     error: true,
            //     message: "Can't continue we got disconnected",
            // });
        });

        // Socket io event
        _socket.on("connect_error", (err) => {
            console.log("CONNECTION ERROR: " + err);
            setSnackbarOpen({
                open: true,
                message: "Connection error!",
                severity: "error",
            });
            setError({ error: true, message: err.message });
            console.log(err.message); // undefined
        });

        return () => _socket.disconnect();
    }, []);

    const handleStartGame = () => {
        if (socket == undefined) {
            return;
        }

        socket.emit("start_game");
    };

    const handleShare = () => {
        // copy id
        // show message about it
        navigator.clipboard.writeText(roomID);

        setSnackbarOpen({
            open: true,
            message: "Room join ID copied!",
            severity: "success",
        });
    };

    const handleLeave = () => {
        // TODO : need to ask user if they are sure before actually leaving this page
        socket?.disconnect();
        navigate("/dashboard");
    };

    const handleSubmitPrompt = (
        prompt: string,
        onSuccess: () => void,
        onFail: () => void
    ): void => {
        if (socket == undefined) {
            return;
            // TODO : throw error, or something
        }

        // console.log(prompt);
        // TODO : need to pass in the written prompt
        // but need to check it first
        socket.emit(
            "submit_prompt",
            { prompt: prompt },
            (moderationResult: { flagged: boolean; reason: {} }) => {
                // TODO : reason for moderation failed is not used
                if (moderationResult == undefined) {
                    onSuccess();
                    return;
                }

                setSnackbarOpen({
                    open: true,
                    message: "Can't submit prompt because its inappropriate.",
                    severity: "warning",
                });

                onFail();
            }
        );
    };

    const handleSubmitGuess = (
        guess: string,
        onSuccess: () => void,
        onFail: () => void
    ) => {
        if (socket == undefined) {
            return;
        }

        // TODO : shouldn't fail, so no need to call onFail
        // however it could if we add validation server side
        socket.emit("submit_guess", { guess: guess });
        onSuccess();
    };

    const selectTopic = (topic: string) => {
        let temp = selectedTopics.slice(0);

        // TODO : check if already there
        let found = temp.find((item) => item == topic);
        if (found) {
            return;
        }

        temp.push(topic);
        setSelectedTopics(temp);

        socket?.emit("room:select_topic", topic);
    };

    const removeSelectedTopic = (topic: string) => {
        let temp = selectedTopics.filter((item) => item != topic);
        setSelectedTopics(temp);

        socket?.emit("room:remove_topic", topic);
    };

    if (error.error || gameState?.gameState.round == "ERROR:A_PLAYER_LEFT") {
        let errorMessage = "";

        if (error.error) {
            errorMessage = error.message;
        } else if (gameState?.gameState.round == "ERROR:A_PLAYER_LEFT") {
            errorMessage =
                "Sorry can't continue, the other player has left the game.";
        }

        return (
            <Box sx={{ mx: "auto", maxWidth: 400, mt: 2 }}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h4" color={theme.palette.error.main}>
                        ERROR
                    </Typography>
                    <Typography sx={{ mt: 2 }}>{errorMessage}</Typography>
                    <Button
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={() =>
                            navigate("/dashboard", { replace: true })
                        }
                    >
                        Leave
                    </Button>
                </Paper>
            </Box>
        );
    }

    if (!connected) {
        return <Box sx={{ mx: "auto", maxWidth: 350 }}>Connecting...</Box>;
    }

    if (gameState == undefined) {
        return (
            <Box sx={{ mx: "auto", maxWidth: 400, mt: 2 }}>
                <Paper>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Typography sx={{ color: "grey", fontSize: 15, mr: 1 }}>
                            {roomID}
                        </Typography>
                    </Box>
                    {/* <Divider /> */}

                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ ml: 2 }}>
                            <Typography variant="h3">Users</Typography>
                            <Typography sx={{ color: "grey" }}>
                                {users.length}/{2}
                            </Typography>
                        </Box>

                        {users &&
                            users.map((groupUser, index) => {
                                let isUs = groupUser.userID == user!.userID;
                                let isCreator = false;

                                if (roomState) {
                                    if (groupUser.userID == roomState.creator)
                                        isCreator = true;
                                }

                                console.log(
                                    "avatarSeed" + groupUser.userAvatarSeed
                                );
                                const config = genConfig(
                                    groupUser.userAvatarSeed
                                );

                                return (
                                    <Paper
                                        key={groupUser.userID + index}
                                        elevation={2}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            p: 1.3,
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Box
                                                position={"relative"}
                                                sx={{
                                                    width: "fit-content",
                                                    height: "fit-content",
                                                    mr: 4,
                                                }}
                                            >
                                                <Avatar
                                                    style={{
                                                        width: "4rem",
                                                        height: "4rem",
                                                    }}
                                                    {...config}
                                                />
                                                {isUs ? (
                                                    <Box
                                                        position={"absolute"}
                                                        sx={{
                                                            height: 25,
                                                            width: 25,
                                                            right: -8,
                                                            bottom: -8,
                                                            borderRadius: 6,
                                                            backgroundColor:
                                                                "black",
                                                        }}
                                                    >
                                                        <PersonIcon />
                                                    </Box>
                                                ) : (
                                                    ""
                                                )}
                                            </Box>
                                            <Typography>
                                                {groupUser.username}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "end",
                                            }}
                                        >
                                            {isCreator ? (
                                                <Box
                                                    sx={{
                                                        maxWidth: 21,
                                                        maxHeight: 21,
                                                        minWidth: 21,
                                                        minHeight: 21,
                                                    }}
                                                >
                                                    <img
                                                        src={crownLogo}
                                                        alt="Crown"
                                                    />
                                                </Box>
                                            ) : (
                                                <></>
                                            )}
                                        </Box>
                                    </Paper>
                                );
                            })}
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ ml: 2 }}>
                            <Typography variant="h3">Topics</Typography>
                            <Typography sx={{ color: "grey" }}>
                                {selectedTopics
                                    .map(
                                        (topic) =>
                                            roomState?.availableTopics.find(
                                                (item) => item.topic == topic
                                            )?.itemsInTopic
                                    )
                                    .reduce((accumulator, currentValue) => {
                                        return accumulator! + currentValue!;
                                    }, 0)}
                            </Typography>
                        </Box>

                        <Paper
                            sx={{
                                display: "flex",
                                justifyContent: "start",
                                flexWrap: "wrap",
                                minHeight: 40,
                                p: 0.5,
                                m: 0,
                            }}
                            elevation={2}
                        >
                            {selectedTopics.map((topic, index) => {
                                return (
                                    <Chip
                                        key={topic + index}
                                        variant="outlined"
                                        label={
                                            topic
                                            // + " " +
                                            // roomState?.availableTopics.find(
                                            //     (item) => item.topic == topic
                                            // )?.itemsInTopic
                                        }
                                        sx={{ mr: 0.4, my: 0.4 }}
                                        onDelete={() => {
                                            removeSelectedTopic(topic);
                                        }}
                                    />
                                );
                            })}
                        </Paper>

                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Add topics</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {roomState &&
                                    roomState.availableTopics.map(
                                        (topic, index) => (
                                            <Chip
                                                key={"topic" + index}
                                                variant="outlined"
                                                label={
                                                    topic.topic +
                                                    " " +
                                                    topic.itemsInTopic
                                                }
                                                sx={{ mr: 0.4, my: 0.4 }}
                                                onClick={() =>
                                                    selectTopic(topic.topic)
                                                }
                                            />
                                        )
                                    )}
                            </AccordionDetails>
                        </Accordion>
                    </Box>

                    <Box
                        sx={{
                            pb: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            mx: 2,
                        }}
                    >
                        {roomState && roomState.creator == user?.userID ? (
                            <Box>
                                <Button
                                    variant="outlined"
                                    onClick={handleStartGame}
                                >
                                    Start Game
                                </Button>
                                <Button onClick={handleShare}>
                                    <ShareRoundedIcon />
                                </Button>
                            </Box>
                        ) : (
                            <div>
                                Waiting for the host to set up the game...
                            </div>
                        )}
                        <Button onClick={handleLeave}>leave</Button>
                    </Box>
                </Paper>

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
            </Box>
        );
    }

    if (gameState.gameState.round == "PROMPTING") {
        return (
            <>
                <Prompting
                    ourState={gameState.ourState}
                    handleSubmitPrompt={handleSubmitPrompt}
                />
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
            </>
        );
    }

    if (gameState.gameState.round == "GUESSING") {
        return (
            <>
                <Guessing
                    ourState={gameState.ourState}
                    handleSubmitGuess={handleSubmitGuess}
                />
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
            </>
        );
    }

    if (gameState.gameState.round == "RESULTS") {
        return <Results results={results} />;
    }

    return <div>Something is wrong :/</div>;
}
