import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinRoom() {
    const [joinRoomID, setJoinRoomID] = useState("");

    const navigate = useNavigate();

    const handleJoinRoom = () => {
        navigate("/gameroom", { state: { roomID: joinRoomID } });
    };

    return (
        <div>
            <h2>Join room</h2>
            <input
                value={joinRoomID}
                onChange={(e) => setJoinRoomID(e.target.value)}
            />
            <button onClick={handleJoinRoom}>join room</button>
        </div>
    );
}
