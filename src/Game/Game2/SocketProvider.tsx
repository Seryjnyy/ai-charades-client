import { useRef, useContext } from "react";
import {
    SocketContext,
    SocketCombinedState,
    SocketStore,
    SocketProps,
    createSocketStore,
} from "./SocketStore";
import { useStore } from "zustand";

type SocketProviderProps = React.PropsWithChildren<SocketProps>;

export function SocketProvider({ children, ...props }: SocketProviderProps) {
    const storeRef = useRef<SocketStore>();
    if (!storeRef.current) {
        storeRef.current = createSocketStore(props);
    }

    return (
        <SocketContext.Provider value={storeRef.current}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocketContext<T>(
    selector: (state: SocketCombinedState) => T
): T {
    const store = useContext(SocketContext);
    if (!store) throw new Error("Missing BearContext.Provider in the tree");
    return useStore(store, selector);
}
