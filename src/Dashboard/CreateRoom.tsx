import { useAuth } from "../Auth/UserAuthContext";

export default function CreateRoom() {
    const { user } = useAuth();

    const handleCreate = () => {
        if (!user) {
            console.log(
                "ERROR: Cannot call create room API cause user is undefined."
            );
            return;
        }

        // TODO : need to allow the user to choose the settings
        // TODO : need to ask the server what topics are available
        fetch("http://localhost:3000/api/rooms/create", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                userID: user.userID,
                roomSettings: {
                    maxPlayer: 2,
                    selectedTopics: ["cartoons", "shows"],
                },
            }),
        });
    };

    return (
        <div>
            <h2>Create room</h2>
            <button onClick={handleCreate}>create new room</button>
        </div>
    );
}
