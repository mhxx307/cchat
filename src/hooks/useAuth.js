import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [userForVerified, setUserForVerified] = useState(null);
    const [userVerified, setUserVerified] = useState(null);

    return (
        <AuthContext.Provider value={{ userForVerified, setUserForVerified, userVerified, setUserVerified }}>
            {children}
        </AuthContext.Provider>
    );
};
