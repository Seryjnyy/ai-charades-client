import { useState } from "react";
import { OurState } from "../GameRoom";

interface GuessingProps {
    ourState: OurState;
    handleSubmitGuess: (guess: string) => void;
}

export default function Guessing({
    ourState,
    handleSubmitGuess,
}: GuessingProps) {
    const [guess, setGuess] = useState("");

    if (ourState == undefined) {
        return <div>Guessing : something went wrong :/</div>;
    }

    if (ourState.guessPlace >= ourState.imagesToGuess.length) {
        return <div>guessing: waiting for other player...</div>;
    }

    return (
        <div>
            <img src={ourState.imagesToGuess[ourState.guessPlace]} />
            <input value={guess} onChange={(e) => setGuess(e.target.value)} />
            <button onClick={() => handleSubmitGuess(guess)}>Guess</button>
        </div>
    );
}
