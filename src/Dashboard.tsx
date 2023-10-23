import { useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./UserAuthContext";

export default function Dashboard() {
    const [joinRoomID, setJoinRoomID] = useState("");
    const [rooms, setRooms] = useState([]);
    const { user } = useAuth();

    const handleCreate = () => {
        if (!user) {
            console.log(
                "ERROR: Cannot call create room API cause user is undefined."
            );
            return;
        }

        fetch("http://localhost:3000/api/rooms/create", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                userID: user.userID,
                roomSettings: { maxPlayer: 2 },
            }),
        });
    };

    const handleGetRooms = () => {
        if (!user) {
            console.log(
                "ERROR: Cannot call get rooms API cause user is undefined."
            );
            return;
        }

        console.log(user.userID);
        fetch("http://localhost:3000/api/rooms/" + user.userID)
            .then((res) => res.json())
            .then((data) => setRooms(data));
    };

    let navigate = useNavigate();

    const handleMoveToRoom = (roomID: string) => {
        console.log(roomID);
        navigate("/gameroom", { state: { roomID: roomID } });
    };

    const handleJoinRoom = () => {
        navigate("/gameroom", { state: { roomID: joinRoomID } });
    };

    return (
        <>
            <p>username</p>
            {user?.username}
            <hr />
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
            <hr />
            <input
                value={joinRoomID}
                onChange={(e) => setJoinRoomID(e.target.value)}
            />
            <button onClick={handleJoinRoom}>join room</button>
        </>
    );
}
