"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { DEMO_USERS } from "@/lib/auth/demoUsers";

export type Role = "user" | "admin";
export interface User {
  email: string;
  name: string;
  role: Role;
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // hydrate from storage on mount (client‑side only)
  useEffect(() => {
    const stored = typeof window !== "undefined" && localStorage.getItem("auth_user");
    if (stored) setUser(JSON.parse(stored));
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const found = DEMO_USERS.find((u) => u.email === email && u.password === password);
    if (!found) return null;
    const { name, role, email: userEmail } = found;
    const loggedUser: User = { name, role, email: userEmail };
    setUser(loggedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_user", JSON.stringify(loggedUser));
    }
    return loggedUser;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
