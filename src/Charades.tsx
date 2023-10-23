import React, { useEffect, useState } from "react";
import { GameState } from "./GameRoom";
import { useAuth } from "./UserAuthContext";

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
            <div>Charades</div>
            {gameState.currentTurnID}
            <br />
            hello{"" + ourTurn}
            <br />
            {/* {!ourTurn ? <div> ourTurn </div> : ""}
            {ourTurn && gameState.topics[gameState.topics.length - 1]} */}
            {ourTurn ? <button onClick={submitPrompt}>next turn</button> : ""}
        </div>
    );
}
