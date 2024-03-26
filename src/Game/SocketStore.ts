import { createContext } from "react";
import { io } from "socket.io-client";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import { SERVER_SOCKET_URL } from "../utility/server";

export interface SocketProps {
    userID: string;
    roomID: string;
    userAvatarSeed: string;
    accessKey: string;
}

export type SocketStore = ReturnType<typeof createSocketStore>;

export const SocketContext = createContext<SocketStore | null>(null);

type InitialState = { bears: number };
export type SetState = { increase: (by: number) => void };

export type SocketCombinedState = InitialState & SetState;

export const createSocketStore = (initProps: SocketProps) => {
    return create(
        combine<InitialState, SetState>({ bears: 0 }, (set) => {
            
            io(SERVER_SOCKET_URL, {
                query: {
                    userID: initProps.userID,
                    groupID: initProps.roomID,
                    userAvatarSeed: initProps.userAvatarSeed,
                    accessKey: initProps.accessKey,
                },
            }).on("connect", () => {
                console.log("entered the room");
            });

            return {
                increase: (by) => set((state) => ({ bears: state.bears + by })),
            };
        })
    );
};
