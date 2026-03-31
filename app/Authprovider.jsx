"use client";
import React, { useEffect, useState, createContext } from "react";
import { useUser } from "@stackframe/stack";
import { useMutation } from "convex/react";
import Provider from "./provider";

export const UserContext = createContext();

function AuthProvider({ children }) {
    const user = useUser();
    const createUser = useMutation("users:createUser");
    const [userData, setUserData] = useState();

    useEffect(() => {
        async function handleCreateUser() {
            if (user) {
                const result = await createUser({
                    name: user.name,
                    email: user.primaryEmail
                });
                setUserData(result);
            }
        }
        handleCreateUser();
    }, [user, createUser]);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
}
export default AuthProvider;