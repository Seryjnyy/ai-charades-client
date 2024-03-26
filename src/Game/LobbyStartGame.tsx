import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import {
  AlertColor,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/UserAuthContext";
import { useWebSocket } from "./SocketContext";
import { useEffect, useState } from "react";

export default function LobbyStartGame({
  useSnackbar,
}: {
  useSnackbar: (severity: AlertColor, message: string) => void;
}) {
  const [startGameCalled, setStartGameCalled] = useState(false);
  const { roomstate, startGame } = useWebSocket();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);

  if (roomstate == undefined) {
    return <div>something went wrong in lobby start game</div>;
  }

  const handleStartGame = () => {
    setStartGameCalled(true);

    setTimeout(() => {
      startGame((result) => {
        if (!result.success) {
          setStartGameCalled(false);

          useSnackbar("warning", result.reason);
        }
      });
    }, 3000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(roomstate.roomID);

    useSnackbar("info", "Join ID copied!");
  };

  const handleLeave = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <Box
        sx={{
          pb: 2,
          display: "flex",
          justifyContent: "space-between",
          mx: 2,
        }}
      >
        {roomstate.creator == user?.userID ? (
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                position: "relative",
                width: "fit",
              }}
            >
              <Button
                variant="outlined"
                onClick={handleStartGame}
                disabled={startGameCalled}
              >
                Start Game
              </Button>
              {startGameCalled && (
                <CircularProgress
                  size={24}
                  sx={{
                    //   color: green[500],
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              )}
            </Box>
            <Button onClick={handleShare}>
              <ShareRoundedIcon />
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ opacity: "70%", p: 0, m: 0 }}>
              Waiting for the host to set up the game...
            </Typography>
          </Box>
        )}
        <Button onClick={() => setOpenDialog(true)}>leave</Button>
      </Box>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={"xs"}
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">{"Leave the game?"}</DialogTitle>
        {/* <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    </DialogContentText>
                </DialogContent> */}
        <DialogActions>
          <Button onClick={handleLeave}>Leave</Button>
          <Button
            variant="contained"
            autoFocus
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
