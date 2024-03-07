import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { useAuth } from "../Auth/UserAuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CreateRoom() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const theme = useTheme();

  const navigate = useNavigate();

  const handleCreate = () => {
    if (!user) {
      console.log(
        "ERROR: Cannot call create room API cause user is undefined."
      );
      return;
    }

    setLoading(true);

    // TODO : Remove artificial delays
    setTimeout(() => {
      fetch("https://localhost:3000/api/rooms/create", {
        headers: {
          "Content-Type": "application/json",
          Authorization: user.accessKey,
        },
        method: "POST",
        body: JSON.stringify({
          userID: user.userID,
          accessKey: user.accessKey,
        }),
      })
        .then(async (res) => {
          setLoading(false);

          if (!res.ok) {
            let reason = await res.text();
            throw new Error(reason);
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
          setError(err.message);
          setLoading(false);
        });
    }, 0);
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
      <Box sx={{ position: "relative" }}>
        <Button
          variant="outlined"
          onClick={handleCreate}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          create
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              //   color: green[500],
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-6px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Box>
      {error != "" && (
        <Typography
          sx={{ color: theme.palette.error.main, px: 4, mt: 1 }}
          fontSize={12}
        >
          *{error}
        </Typography>
      )}
    </Box>
  );
}
