import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/UserAuthContext";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";
import YourRooms from "./YourRooms";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <>
            <h1>Dashboard</h1>
            <p>username: {user?.username}</p>
            <hr />
            <CreateRoom />
            <hr />
            <YourRooms />
            <hr />
            <JoinRoom />
        </>
    );
}
