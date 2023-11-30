import { useLocation } from "react-router-dom";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import { useAuth } from "../../Auth/UserAuthContext";
import { Socket, io } from "socket.io-client";

// interface InitialState {
//     socketState : "CONNECTED" | "DISCONNECTED"
//     actions : ""
//   }

type InitialState = { bears: number };
type SetState = { increase: (by: number) => void };

const useStore = create(
    combine<InitialState, SetState>({ bears: 0 }, (set) => {
        console.log("on creation of store");

        const { state } = useLocation();
        const { roomID } = state;
        const { user } = useAuth();

        if (user) {
            const _socket: Socket = io("wss://localhost:3000", {
                query: {
                    userID: user.userID,
                    groupID: roomID,
                    userAvatarSeed: user.userAvatarSeed,
                    accessKey: user.accessKey,
                },
            });

            _socket.on("connect", () => console.log("hello connected"));
        }
        return {
            increase: (by) => set((state) => ({ bears: state.bears + by })),
        };
    })
);

export { useStore };
