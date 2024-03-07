import { Box, Paper, Stack } from "@mui/material";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";
import HowToPlay from "./HowToPlay";

export default function Dashboard() {
  return (
    <Box sx={{ mx: "auto", maxWidth: 400, mt: 2 }}>
      <Stack gap={4} sx={{ mx: 2 }}>
        <Paper sx={{ py: 2 }}>
          <CreateRoom />
        </Paper>
        <Paper sx={{ py: 2 }}>
          <JoinRoom />
        </Paper>
        <HowToPlay />
      </Stack>
    </Box>
  );
}
