import { useState } from "react";
import { OurState } from "../GameRoom";
import * as filterWords from "../../filter.json";

interface PromptingProps {
    ourState: OurState;
    handleSubmitPrompt: (prompt: string) => void;
}

export default function Prompting({
    ourState,
    handleSubmitPrompt,
}: PromptingProps) {
    const [prompt, setPrompt] = useState<string>("");
    const [promptError, setPromptError] = useState("");

    if (ourState == undefined) {
        return <div>Something went wrong, no user game state.</div>;
    }

    if (ourState.topicPlace >= ourState.topics.length) {
        return <div>prompting: waiting for other player...</div>;
    }

    const doesPromptContainWordsFromTopic = (prompt: string): boolean => {
        // Check for use of words from topic
        let topic = ourState.topics[ourState.topicPlace].slice(0);
        topic.toLocaleLowerCase();

        // TODO : won't work well when there is grammar
        // TODO : maybe remove words and letters like: the, a, an, and etc.
        var wordsInTopic = topic.toLocaleLowerCase().split(" ");

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

    const doesPromptContainProfanity = (prompt: string): boolean => {
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
        // no grammer

        if (doesPromptContainWordsFromTopic(prompt)) {
            setPromptError("no using words from topic");
            return;
        }

        if (doesPromptContainProfanity(prompt)) {
            setPromptError("no profanity");
            return;
        }

        setPromptError("");
        handleSubmitPrompt(prompt);
    };

    return (
        <div>
            <div>{ourState.topics[ourState.topicPlace]}</div>
            <input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            <p>{promptError}</p>
            <button onClick={() => checkPromptAndSubmit(prompt)}>submit</button>
        </div>
    );
}
