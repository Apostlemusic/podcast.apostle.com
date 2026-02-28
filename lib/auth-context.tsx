"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "./api"; // Ensure this matches your single file export structure

export type User = {
    _id: string;
    email: string;
    name: string;
    about?: string;
    description?: string;
    isVerified: boolean;
    followers: string[];
    following: string[];
    profileImg?: string;
    bannerImg?: string;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const response = await getMe();
            setUser(response.data.podcaster);
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            setUser(null);
            if (typeof window !== "undefined") localStorage.removeItem("accessToken");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = (token: string) => {
        if (typeof window !== "undefined") localStorage.setItem("accessToken", token);
        fetchUser();
    };

    const logout = () => {
        if (typeof window !== "undefined") localStorage.removeItem("accessToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
