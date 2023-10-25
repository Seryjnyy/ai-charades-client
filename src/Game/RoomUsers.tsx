import { Socket } from "socket.io-client";

// TODO : NOT USED RIGHT NOW
interface RoomUsersProps {
    socket: Socket | undefined;
}

export default function RoomUsersProps({ socket }: RoomUsersProps) {
    return <div>RoomUsers</div>;
}
