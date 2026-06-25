/* eslint-disable react-refresh/only-export-components */
// ============================================================
// AuthContext.tsx — Role-based authentication context
// ============================================================
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User } from "../types";
import { authService } from "../services/authService";

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  updateSessionUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.loadSession());

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";

  // Keep session in sync when tab focuses back
  useEffect(() => {
    const handleFocus = () => {
      const session = authService.loadSession();
      setUser(session);
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const loggedIn = await authService.login(email, password);
    authService.saveSession(loggedIn);
    setUser(loggedIn);
  }, []);

  const register = useCallback(
    async (name: string, email: string, phone: string, password: string) => {
      const newUser = await authService.register(name, email, phone, password);
      authService.saveSession(newUser);
      setUser(newUser);
    },
    []
  );

  const logout = useCallback(() => {
    authService.clearSession();
    setUser(null);
  }, []);

  const updateSessionUser = useCallback((updated: User) => {
    authService.saveSession(updated);
    setUser(updated);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isAdmin, isCustomer, login, register, logout, updateSessionUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
