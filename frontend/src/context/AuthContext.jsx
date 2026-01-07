import React, { createContext, useContext, useEffect, useState } from 'react'
import { getMe } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const bootstrapAuth = async () => {
            try {
                const res = await getMe();
                setUser(res.user);
            } catch(err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        bootstrapAuth();
    }, []);

    const login = (userData) => {
        setUser(userData);
    }
    const logout = () => {
        localStorage.removeItem('token');
        document.cookie = "token=; Max-Age=0; path=/;";
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: Boolean(user),
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>   
    )
};

export const useAuth = () => {
    return useContext(AuthContext);
}