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
import filterWords from "../../filter.json";

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
                <Typography>waiting for other player or the AI...</Typography>
            </Box>
        </Box>
    );
};

export default function GamePrompting() {
    const { roomstate, submitPrompt } = useWebSocket();
    const [prompt, setPrompt] = useState<string>("");
    const [promptError, setPromptError] = useState("");
    const [submittedPrompt, setSubmittedPrompt] = useState(false);

    if (roomstate == undefined) {
        return <div> something went wrong in game prompting</div>;
    }

    if (
        roomstate.userGameState.topicPlace >=
        roomstate.userGameState.topics.length
    ) {
        return <Waiting />;
    }

    const allowedWords = ["the", "a", "and", "of", "or", "an", "on"];
    const doesPromptContainWordsFromTopic = (prompt: string): boolean => {
        // Check for use of words from topic
        let topic =
            roomstate.userGameState.topics[
                roomstate.userGameState.topicPlace
            ].slice(0);
        topic.toLocaleLowerCase();

        // TODO : won't work well when there is grammar
        var wordsInTopic = topic.toLocaleLowerCase().split(" ");
        wordsInTopic = wordsInTopic.filter((word) => {
            if (allowedWords.includes(word)) {
                return false;
            }

            return true;
        });

        let topicWordsInPrompt = false;

        // Using for loop to break early
        for (let i = 0; i < wordsInTopic.length; i++) {
            let word = wordsInTopic[i];

            console.log("checking word: " + word);
            if (RegExp("\\b" + word + "\\b").test(prompt)) {
                topicWordsInPrompt = true;
                break;
            }
        }

        return topicWordsInPrompt;
    };

    const containsInappropriateLanguage = (prompt: string): boolean => {
        let profanityInPrompt = false;

        for (let i = 0; i < filterWords.swearwords.length; i++) {
            let word = filterWords.swearwords[i];

            console.log("checking word: " + word);
            if (RegExp("\\b" + word + "\\b").test(prompt)) {
                profanityInPrompt = true;
                break;
            }
        }

        return profanityInPrompt;
    };

    // TODO : get some sanitization library
    const checkPromptAndSubmit = (prompt: string) => {
        // maybe no grammar apart from . ,
        let trimmedPrompt = prompt.trim();

        if (doesPromptContainWordsFromTopic(trimmedPrompt)) {
            setPromptError(
                "no using words from topic (the, of, a etc. are allowed)"
            );
            return;
        }

        // TODO : no need because we are using openai moderation api
        if (containsInappropriateLanguage(trimmedPrompt)) {
            setPromptError("no profanity");
            return;
        }

        if (trimmedPrompt.length > 200) {
            setPromptError("prompt needs to be less than 200 characters");
            return;
        }

        if (trimmedPrompt.length < 3) {
            setPromptError("prompt needs to be longer than 2 characters");
            return;
        }

        setSubmittedPrompt(true);
        setPromptError("");

        submitPrompt(
            prompt,
            ({ success, reason }: { success: boolean; reason: string }) => {
                setSubmittedPrompt(false);

                if (!success) {
                    console.log(reason);
                    // TODO : let user know why it failed
                } else {
                    setPrompt("");
                }
            }
        );
    };

    return (
        <Box sx={{ mx: "auto", maxWidth: 350 }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h4">Write a prompt</Typography>
                <Paper sx={{ width: "fit-content", p: 1, my: 1 }}>
                    {
                        roomstate.userGameState.topics[
                            roomstate.userGameState.topicPlace
                        ]
                    }
                </Paper>
                <TextField
                    value={prompt}
                    error={promptError != ""}
                    helperText={promptError}
                    onChange={(e) => setPrompt(e.target.value)}
                    sx={{ mb: 4 }}
                />

                <Button
                    variant="outlined"
                    onClick={() => checkPromptAndSubmit(prompt)}
                    disabled={submittedPrompt}
                >
                    submit
                </Button>
            </Box>
        </Box>
    );
}
