import { useState } from "react";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import { useAuth } from "../Auth/UserAuthContext";

export default function LoginAndPlay() {
    const [username, setUsername] = useState<string>("");
    const { user, register, logout } = useAuth();

    let navigate = useNavigate();

    const isUsernameValid = () => {
        if (username == undefined) {
            return false;
        }

        return true;
    };

    const handleStartGame = () => {
        if (user) {
            // TODO : implement, navigate out
            console.log("go to dashboard");
            navigate("/dashboard");
            return;
        }

        if (!isUsernameValid()) return;

        register(uuid(), username);
        // I think its fine if its optimistic, if user doesn't set properly then we will
        // just get redirected back to this page
        navigate("/dashboard");
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            {!user && (
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            )}
            {user?.username}
            <br />#{user?.id}
            <br />
            <button onClick={handleStartGame}>Play as guest</button>
            <button onClick={handleLogout}>Logout</button>
        </>
    );
}
