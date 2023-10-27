import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/UserAuthContext";
import { Box, Button, Typography } from "@mui/material";

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
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography variant="h3">Your rooms</Typography>

            <Button variant="outlined" onClick={handleGetRooms}>
                get rooms
            </Button>
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
        </Box>
    );
}
