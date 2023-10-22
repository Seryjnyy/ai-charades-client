import { useEffect, useState } from "react";
import {
    useLocation,
    unstable_useBlocker as useBlocker,
} from "react-router-dom";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client/debug";

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
    const [metadata, setMetadata] = useState({});

    const { state } = useLocation();
    const { roomID } = state;

    //establish connection with the websocket
    const handleEnter = () => {
        const socket = io("ws://localhost:3000", {
            query: {
                userID: "test",
                groupID: roomID,
            },
        });

        socket.on("connect", () => {
            setConnected(true);
            console.log("entered the room");

            // on connection get users in room
            // in case we are not first
        });

        socket.on("user_change", (data) => {
            setUsers(data);
            console.log(data);
        });

        socket.on("metadata", (data) => {
            setMetadata(data);
            console.log(data);
        });
    };

    return (
        <>
            <div>GameRoom for {roomID}</div>
            <h2>Users</h2>
            {users &&
                users.map((user, index) => (
                    <div key={user + index}>{user}</div>
                ))}
            <h2>Settings</h2>
            {metadata && (
                <div>
                    <div>{metadata.gametype}</div>
                    <div>{metadata.maxPlayer}</div>
                </div>
            )}
            <button onClick={handleEnter} disabled={connected}>
                enter room
            </button>
        </>
    );
}
