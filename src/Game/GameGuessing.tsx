import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useWebSocket } from "./SocketContext";
import filterWords from "../filter.json";

const Waiting = () => {
  return (
    <Box sx={{ mx: "auto", maxWidth: 350 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={20} sx={{ mr: 2 }} />
        <Typography>waiting for other player...</Typography>
      </Box>
    </Box>
  );
};

export default function GameGuessing() {
  const { roomstate, submitGuess } = useWebSocket();
  const [guess, setGuess] = useState("");
  const [guessError, setGuessError] = useState("");
  const [blockSubmit, setBlockSubmit] = useState(false);

  if (roomstate == undefined) {
    return <div> something went wrong in game prompting</div>;
  }

  // TODO : Duplicate code in prompting
  const containsInappropriateLanguage = (prompt: string): boolean => {
    let inappropriateLang = false;

    for (let i = 0; i < filterWords.swearwords.length; i++) {
      let word = filterWords.swearwords[i];

      console.log("checking word: " + word);
      if (RegExp("\\b" + word + "\\b").test(prompt)) {
        inappropriateLang = true;
        break;
      }
    }

    return inappropriateLang;
  };

  const checkGuessAndSubmit = () => {
    let trimmedGuess = guess.trim();

    if (trimmedGuess.length > 100) {
      setGuessError("can't be longer than 100 characters.");
      return;
    }

    if (trimmedGuess.length < 2) {
      setGuessError("can't have a empty guess, need at least a word.");
      return;
    }

    if (containsInappropriateLanguage(guess.toLocaleLowerCase())) {
      setGuessError("no inappropriate language.");
      return;
    }

    setGuessError("");
    setBlockSubmit(true);

    // TODO : shouldn't fail, so no need to call onFail
    // however it could if we add validation server side
    const callback = ({
      success,
      reason,
    }: {
      success: boolean;
      reason: string;
    }) => {
      setBlockSubmit(false);
      if (!success) {
        console.log(reason);
        // TODO : let the user know why
      } else {
        setGuess("");
      }
    };

    submitGuess(guess, callback);
  };

  if (
    roomstate.userGameState.guessPlace >=
    roomstate.userGameState.imagesToGuess.length
  ) {
    return <Waiting />;
  }

  return (
    <Box sx={{ mx: "auto", maxWidth: 350 }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Guess the topic
        </Typography>

        <img
          src={
            roomstate.userGameState.imagesToGuess[
              roomstate.userGameState.guessPlace
            ]
          }
        />
        <p>{""}</p>
        <TextField
          value={guess}
          error={guessError != ""}
          helperText={guessError}
          onChange={(e) => setGuess(e.target.value)}
          sx={{ mb: 4 }}
        />
        <Button
          variant="outlined"
          onClick={() => checkGuessAndSubmit()}
          disabled={blockSubmit}
        >
          Guess
        </Button>
      </Box>
    </Box>
  );
}
