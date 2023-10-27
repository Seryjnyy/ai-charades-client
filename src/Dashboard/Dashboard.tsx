import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/UserAuthContext";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";
import YourRooms from "./YourRooms";
import { Box, Paper, Stack, Typography } from "@mui/material";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <>
            <Typography variant="h2" sx={{ ml: 2 }}>
                Dashboard
            </Typography>
            <Stack gap={4} sx={{ mx: 2 }}>
                <Paper sx={{ py: 2 }}>
                    <YourRooms />
                </Paper>
                <Paper sx={{ py: 2 }}>
                    <CreateRoom />
                </Paper>
                <Paper sx={{ py: 2 }}>
                    <JoinRoom />
                </Paper>
            </Stack>
        </>
    );
}
