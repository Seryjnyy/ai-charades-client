import { Box, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import LoginAndPlay from "./LoginAndPlay";

export default function LandingPage() {
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
