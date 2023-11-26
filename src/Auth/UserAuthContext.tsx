import React, { createContext, useContext, useEffect, useState } from "react";
import { createUserID } from "../utility/username";

interface AuthContextType {
    user: User | undefined;
    register: (uuid: string, username: string, userAvatarSeed: string) => void;
    registerWithSecretKey: (
        uuid: string,
        username: string,
        userAvatarSeed: string,
        secretKey: string
    ) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// UserID is whats used by the server
// but its nice to have the id and username separate to use
interface User {
    id: string;
    username: string;
    userID: string;
    userAvatarSeed: string;
    accessKey: string;
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

    const register = (
        uuid: string,
        username: string,
        userAvatarSeed: string
    ) => {
        localStorage.setItem(
            "user",
            JSON.stringify({
                id: uuid,
                username: username,
                userID: createUserID({ username: username, id: uuid }),
                userAvatarSeed: userAvatarSeed,
                authToken: "pass",
            })
        );
        setUserFromLocalStorage();
    };

    const registerWithSecretKey = async (
        uuid: string,
        username: string,
        userAvatarSeed: string,
        secretKey: string
    ) => {
        // call api
        let success = false;

        await fetch("https://localhost:3000/api/register", {
            method: "POST",
            body: JSON.stringify({ accessKey: secretKey }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((result) => {
            if (!result.ok) {
                // TODO : better error handling
                console.log("ERROR, can't register incorrect secret");
                return;
            }

            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: uuid,
                    username: username,
                    userID: createUserID({ username: username, id: uuid }),
                    userAvatarSeed: userAvatarSeed,
                    accessKey: secretKey,
                })
            );

            success = true;
        });

        if (success) {
            setUserFromLocalStorage();
        }

        return success;
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(undefined);
    };

    return (
        <AuthContext.Provider
            value={{ user, register, logout, registerWithSecretKey }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
