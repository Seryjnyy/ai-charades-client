import { useState } from "react";
import { OurState } from "../GameRoom";
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import * as filterWords from "../../filter.json";

interface GuessingProps {
    ourState: OurState;
    handleSubmitGuess: (
        guess: string,
        onSuccess: () => void,
        onFail: () => void
    ) => void;
}

export default function Guessing({
    ourState,
    handleSubmitGuess,
}: GuessingProps) {
    const [guess, setGuess] = useState("");
    const [guessError, setGuessError] = useState("");
    const [blockSubmit, setBlockSubmit] = useState(false);

    // TODO : if used in prompting then its duplicate code
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

    const onSuccess = () => {
        setGuess("");
        setBlockSubmit(false);
    };

    const onFail = () => {
        setBlockSubmit(false);
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
        handleSubmitGuess(trimmedGuess, onSuccess, onFail);
    };

    if (ourState == undefined) {
        return <div>Guessing : something went wrong :/</div>;
    }

    if (ourState.guessPlace >= ourState.imagesToGuess.length) {
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
    }

    return (
        <Box sx={{ mx: "auto", maxWidth: 350 }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h4" sx={{ mb: 1 }}>
                    Guess the topic
                </Typography>

                <img src={ourState.imagesToGuess[ourState.guessPlace]} />
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
