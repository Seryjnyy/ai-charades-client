import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinRoom() {
    const [joinRoomID, setJoinRoomID] = useState("");
    const [joinRoomIDError, setJoinRoomIDError] = useState("");

    const navigate = useNavigate();

    const handleJoinRoom = () => {
        if (joinRoomID == "") {
            setJoinRoomIDError("Join code can't be empty.");
            return;
        }

        if (joinRoomID.length > 20) {
            setJoinRoomIDError("Join code can't be longer than 20 characters.");
            return;
        }

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
                error={joinRoomIDError != ""}
                helperText={joinRoomIDError}
                value={joinRoomID}
                onChange={(e) => setJoinRoomID(e.target.value)}
            />
            <Button variant="outlined" onClick={handleJoinRoom} sx={{ mt: 2 }}>
                join
            </Button>
        </Box>
    );
}
