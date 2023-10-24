import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/UserAuthContext";

export default function YourRooms() {
    const [rooms, setRooms] = useState([]);

    const { user } = useAuth();

    let navigate = useNavigate();

    const handleMoveToRoom = (roomID: string) => {
        console.log(roomID);
        navigate("/gameroom", { state: { roomID: roomID } });
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

    return (
        <div>
            <h2>Your rooms</h2>

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
        </div>
    );
}
