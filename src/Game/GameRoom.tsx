import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../Auth/UserAuthContext";
import Charades from "./Gameplay/Charades";
import Prompting from "./Gameplay/Prompting";
import Guessing from "./Gameplay/Guessing";
import Results from "./Gameplay/Results";

// taken from server
interface Metadata {
    maxPlayer?: number;
    gameType?: string;
    creator: string;
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

export interface Result {
    topic: string;
    prompt: string;
    guess: string;
    imageURI: string;
    originatorID: string; // userID
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
    const [users, setUsers] = useState([]);
    const [metadata, setMetadata] = useState<Metadata>();
    const [socket, setSocket] = useState<Socket>();
    const [gameState, setGameState] = useState<GameState>();
    const [results, setResults] = useState<Result[]>();

    const { state } = useLocation();
    const { roomID } = state;

    const { user } = useAuth();

    const navigate = useNavigate();

    //establish connection with the websocket
    const handleEnter = () => {
        if (!user) {
            console.log(
                "ERROR: Can't start web socket connection because user is undefined."
            );
            return;
        }

        const _socket = io("ws://localhost:3000", {
            query: {
                userID: user.userID,
                groupID: roomID,
            },
        });

        setSocket(_socket);

        // could probably move to useEffect
        _socket.on("connect", () => {
            setConnected(true);
            console.log("entered the room");

            // on connection get users in room
            // in case we are not first
        });

        _socket.on("user_change", (data) => {
            setUsers(data);
            console.log(data);
        });

        _socket.on("metadata", (data) => {
            setMetadata(data);
            console.log(data);
        });

        _socket.on("game_start", (data) => {
            console.log(data);
            setGameState(data);
        });

        _socket.on("game_state_update", (data) => {
            console.log("GAME STATE  UPDATE");
            console.log(data);
            setGameState(data);
        });

        _socket.on("results", (data) => {
            console.log(data);
            setResults(data.results);

            console.log("DISCONNECTING FROM SOCKET");
            _socket.disconnect();
        });
    };

    const handleStartGame = () => {
        if (socket == undefined) {
            return;
        }

        socket.emit("start_game", "start pls");
    };

    const handleLeave = () => {
        // TODO : need to ask user if they are sure before actually leaving this page
        socket?.disconnect();
        navigate("/dashboard");
    };

    const handleSubmitPrompt = (prompt: string) => {
        if (socket == undefined) {
            return;
            // TODO : throw error, or something
        }

        // console.log(prompt);
        // TODO : need to pass in the written prompt
        // but need to check it first
        socket.emit("submit_prompt", { prompt: prompt });
    };

    const handleSubmitGuess = (guess: string) => {
        if (socket == undefined) {
            return;
        }

        socket.emit("submit_guess", { guess: guess });
    };

    if (gameState == undefined) {
        return (
            <div>
                <div>GameRoom for {roomID}</div>

                <button onClick={handleEnter} disabled={connected}>
                    enter room
                </button>
            </div>
        );
    }

    // TODO : redundant gamestate.gamestate
    if (gameState.gameState.round == "LOBBY") {
        return (
            <div>
                <h2>Users</h2>
                {users &&
                    users.map((user, index) => (
                        <div key={user + index}>{user}</div>
                    ))}
                <h2>Settings</h2>
                {metadata && (
                    <div>
                        <div>{metadata.gameType}</div>
                        <div>{metadata.maxPlayer}</div>
                    </div>
                )}

                <button onClick={handleLeave}>leave</button>

                {socket && metadata && metadata.creator == user?.userID && (
                    <button onClick={handleStartGame}>start game</button>
                )}
            </div>
        );
    }

    if (gameState.gameState.round == "PROMPTING") {
        return (
            <Prompting
                ourState={gameState.ourState}
                handleSubmitPrompt={handleSubmitPrompt}
            />
        );
    }

    if (gameState.gameState.round == "GUESSING") {
        return (
            <Guessing
                ourState={gameState.ourState}
                handleSubmitGuess={handleSubmitGuess}
            />
        );
    }

    if (gameState.gameState.round == "RESULTS") {
        return <Results results={results} />;
    }

    return <div>Something is wrong :/</div>;
}
