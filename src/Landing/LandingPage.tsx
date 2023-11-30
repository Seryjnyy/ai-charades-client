import { Box, Container, Typography } from "@mui/material";
import LoginAndPlay from "./LoginAndPlay";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/UserAuthContext";

export default function LandingPage() {
    const { user } = useAuth();
    let navigate = useNavigate();
    let location = useLocation();
    const redirectPath = location.state?.path || "/";

    useEffect(() => {
        // Work around for when page is refreshed and user is lost.
        // The user is sent here before we have chance to load in user again.
        // Therefore, if user not null and we got redirected from somewhere, then get back there son.
        // if (user != null && (redirectPath != "/" || redirectPath != "/")) {
        //     navigate(redirectPath);
        // }
    }, [user]);

    return (
        <Box sx={{ mx: "auto", maxWidth: 400 }}>
            <Box>
                <Typography variant="h1" sx={{ fontSize: { xs: 60 } }}>
                    charades-ai
                </Typography>
            </Box>
            <Box sx={{ mx: 2, pt: 2, pb: 1 }}>
                <Typography sx={{ color: "gray", mb: 2 }}>
                    Charades using Dalle for image generation.
                </Typography>
            </Box>
            <Paper sx={{ p: 4 }}>
                <LoginAndPlay />
            </Paper>
        </Box>
    );
}
