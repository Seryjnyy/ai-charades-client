import { useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [username, setUsername] = useState("");
    const [joinRoomID, setJoinRoomID] = useState("");
    const [rooms, setRooms] = useState([]);

    const handleCreate = () => {
        fetch("http://localhost:3000/api/rooms/create", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                userID: username,
                roomSettings: { maxPlayer: 2 },
            }),
        });
    };

    const handleGetRooms = () => {
        fetch("http://localhost:3000/api/rooms/" + username)
            .then((res) => res.json())
            .then((data) => setRooms(data));
    };

    let navigate = useNavigate();

    const handleMoveToRoom = (roomID) => {
        console.log(roomID);
        navigate("/gameroom", { state: { roomID: roomID } });
    };

    const handleJoinRoom = () => {
        navigate("/gameroom", { state: { roomID: joinRoomID } });
    };

    return (
        <>
            <p>username</p>
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <button onClick={handleCreate}>create new room</button>
            <br />
            <button onClick={handleGetRooms}>get rooms</button>
            <br />
            <h3>rooms</h3>
            {rooms &&
                rooms.map((roomID) => (
                    <button
                        key={roomID}
                        onClick={() => handleMoveToRoom(roomID)}
                    >
                        {roomID}
                    </button>
                ))}
            <br />
            <input
                value={joinRoomID}
                onChange={(e) => setJoinRoomID(e.target.value)}
            />
            <button onClick={handleJoinRoom}>join room</button>
        </>
    );
}
