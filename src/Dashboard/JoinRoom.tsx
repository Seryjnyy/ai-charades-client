import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinRoom() {
    const [joinRoomID, setJoinRoomID] = useState("");

    const navigate = useNavigate();

    const handleJoinRoom = () => {
        navigate("/gameroom", { state: { roomID: joinRoomID } });
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography variant="h3">Join room</Typography>
            <TextField
                value={joinRoomID}
                onChange={(e) => setJoinRoomID(e.target.value)}
            />
            <Button variant="outlined" onClick={handleJoinRoom}>
                join room
            </Button>
        </Box>
    );
}
