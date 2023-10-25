import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

// TODO : NOT USED RIGHT NOW

interface RoomMetadataProps {
    socket: Socket | undefined;
}

// taken from server
interface Metadata {
    maxPlayer?: number;
    gameType?: string;
    creator: string;
}

export default function RoomMetadata({ socket }: RoomMetadataProps) {
    const [metadata, setMetadata] = useState<Metadata>();

    useEffect(() => {
        if (socket == undefined) return;

        socket.on("metadata", (data) => {
            setMetadata(data);
            console.log(data);
        });
    }, [socket]);

    return (
        <div>
            {metadata && (
                <div>
                    <div>{metadata.gameType}</div>
                    <div>{metadata.maxPlayer}</div>
                </div>
            )}
        </div>
    );
}
