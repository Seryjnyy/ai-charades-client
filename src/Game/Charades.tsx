import React, { useEffect, useState } from "react";
import { GameState } from "./GameRoom";
import { useAuth } from "../Auth/UserAuthContext";

interface CharadesProps {
    gameState: GameState;
    handleSubmitPrompt: () => void;
}

export default function Charades({
    gameState,
    handleSubmitPrompt: submitPrompt,
}: CharadesProps) {
    const { user } = useAuth();
    // TODO : might not need to set the state here, if useEffect does it at the start
    const [ourTurn, setOurTurn] = useState(
        gameState.currentTurnID == user?.userID
    );

    useEffect(() => {
        // setOurTurn(gameState.currentTurnID == user?.userID);
        // console.log(ourTurn);
        setOurTurn(gameState.currentTurnID == user?.userID);
        // console.l
    }, [gameState]);

    // console.log(gameState.currentTurnID == user?.userID);

    return (
        <div>
            {ourTurn ? (
                <button onClick={submitPrompt}>submit prompt</button>
            ) : (
                ""
            )}
            {gameState.imageURIs.map((uri, index) => (
                <img key={"image" + index} src={uri} />
            ))}
        </div>
    );
}
