import { useLocation } from "react-router-dom";
import { useAuth } from "../../Auth/UserAuthContext";
import { SocketProvider, useSocketContext } from "./SocketProvider";

const Some = () => {
    const bears = useSocketContext((s) => s.bears);
    const addBear = useSocketContext((s) => s.increase);

    return (
        <>
            <div>{bears} Bears.</div>
            <button onClick={() => addBear(1)}>Add bear</button>
        </>
    );
};

// TODO : throw error for error boundary if roomID not present
export default function GameRoom2() {
    const { user } = useAuth();
    const { state } = useLocation();

    if (!state) {
        return <div>no state provided</div>;
    }

    if (!state.roomID) {
        return <div> no roomID in state</div>;
    }

    if (!user) {
        return <div>user doesn't exist</div>;
    }

    const { roomID } = state;
    return (
        <SocketProvider
            userID={user.userID}
            groupID={roomID}
            userAvatarSeed={user.userAvatarSeed}
            accessKey={user.accessKey}
        >
            <div>
                <Some />
            </div>
        </SocketProvider>
    );
}
