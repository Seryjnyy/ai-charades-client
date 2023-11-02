import { useState } from "react";
import { OurState } from "../GameRoom";
import * as filterWords from "../../filter.json";
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

interface PromptingProps {
    ourState: OurState;
    handleSubmitPrompt: (
        prompt: string,
        onSuccess: () => void,
        onFail: () => void
    ) => void;
}

export default function Prompting({
    ourState,
    handleSubmitPrompt,
}: PromptingProps) {
    const [prompt, setPrompt] = useState<string>("");
    const [promptError, setPromptError] = useState("");
    const [submittedPrompt, setSubmittedPrompt] = useState(false);

    if (ourState == undefined) {
        return <div>Something went wrong, no user game state.</div>;
    }

    if (ourState.topicPlace >= ourState.topics.length) {
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
                    <Typography>
                        waiting for other player or the AI...
                    </Typography>
                </Box>
            </Box>
        );
    }

    const allowedWords = ["the", "a", "and", "of", "or", "an", "on"];
    const doesPromptContainWordsFromTopic = (prompt: string): boolean => {
        // Check for use of words from topic
        let topic = ourState.topics[ourState.topicPlace].slice(0);
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

    const onSuccess = () => {
        setPrompt("");
        setSubmittedPrompt(false);
    };

    const onFail = () => {
        setSubmittedPrompt(false);
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

        // remove trailing and preceding white space
        // if(prompt.length < 3){

        // }

        setSubmittedPrompt(true);
        setPromptError("");
        handleSubmitPrompt(trimmedPrompt, onSuccess, onFail);
    };

    return (
        <Box sx={{ mx: "auto", maxWidth: 350 }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h4">Write a prompt</Typography>
                <Paper sx={{ width: "fit-content", p: 1, my: 1 }}>
                    {ourState.topics[ourState.topicPlace]}
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
