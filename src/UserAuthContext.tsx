import React, { createContext, useContext, useEffect, useState } from "react";
import { createUserID } from "./utility/username";

interface AuthContextType {
    user: User | undefined;
    register: (uuid: string, username: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// UserID is whats used by the server
// but its nice to have the id and username separate to use
interface User {
    id: string;
    username: string;
    userID: string;
}

export function UserAuthContext({ children }: any) {
    const [user, setUser] = useState<User>();

    const setUserFromLocalStorage = () => {
        let userFound = localStorage.getItem("user");
        if (userFound == null) {
            console.log(
                "ERROR:User Auth Context: didn't not find user in local storage"
            );
            return;
        }
        setUser(JSON.parse(userFound));
    };

    useEffect(() => {
        setUserFromLocalStorage();

        // TODO : unsure if this does what it should
        const unsubscribe = () => {
            setUserFromLocalStorage();
        };

        // return a function that will call unsubscribe
        return () => {
            unsubscribe();
        };
    }, []);

    const register = (uuid: string, username: string) => {
        localStorage.setItem(
            "user",
            JSON.stringify({
                id: uuid,
                username: username,
                userID: createUserID({ username: username, id: uuid }),
            })
        );
        setUserFromLocalStorage();
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(undefined);
    };

    return (
        <AuthContext.Provider value={{ user, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
