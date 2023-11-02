import { Box, Button, Typography } from "@mui/material";
import { useAuth } from "../Auth/UserAuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CreateRoom() {
    const [apiCalled, setApiCalled] = useState(false);
    const { user } = useAuth();

    const navigate = useNavigate();

    const handleCreate = () => {
        if (!user) {
            console.log(
                "ERROR: Cannot call create room API cause user is undefined."
            );
            return;
        }

        setApiCalled(true);

        fetch("http://localhost:3000/api/rooms/create", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                userID: user.userID,
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to create room.");
                }

                return res.json();
            })
            .then((data) => {
                console.log(data);
                navigate("/gameroom", { state: { roomID: data.roomID } });
            })
            .catch((err) => {
                // Do something based on error
                console.log(err);
                setApiCalled(false);
            });
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography variant="h3">Create room</Typography>
            <Button
                variant="outlined"
                onClick={handleCreate}
                disabled={apiCalled}
                sx={{ mt: 2 }}
            >
                create
            </Button>
        </Box>
    );
}
