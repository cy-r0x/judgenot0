"use client";

/**
 * Authentication Context Provider
 * Manages global authentication state across the application
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  getUser,
  setUser as saveUser,
  clearUser,
  isAuthenticated as checkAuth,
  getUserRole,
  getUsername,
} from "@/utils/auth";

const AuthContext = createContext(undefined);

/**
 * Hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = () => {
      const userData = getUser();
      setUserState(userData);
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login function
   */
  const login = (userData) => {
    saveUser(userData);
    setUserState(userData);

    // Redirect based on role
    const role = userData.role;
    if (role === "admin") {
      router.push("/admin");
    } else if (role === "setter") {
      router.push("/setter");
    } else {
      router.push("/contests");
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    clearUser();
    setUserState(null);
    router.push("/login");
  };

  /**
   * Update user data
   */
  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    saveUser(updatedUser);
    setUserState(updatedUser);
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = () => {
    return !!user && checkAuth();
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (role) => {
    return user?.role === role;
  };

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    hasRole,
    hasAnyRole,
    role: user?.role || null,
    username: user?.username || null,
    userId: user?.id || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
