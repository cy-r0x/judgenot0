"use client";

/**
 * Higher Order Component for route protection
 * Wraps components that require authentication
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * HOC to protect routes that require authentication
 * @param {React.Component} Component - Component to protect
 * @returns {React.Component} Protected component
 */
export const withAuth = (Component) => {
  return function ProtectedRoute(props) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated()) {
        router.push("/login");
      }
    }, [loading, isAuthenticated, router]);

    // Show loading while checking auth
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      );
    }

    // Don't render if not authenticated
    if (!isAuthenticated()) {
      return null;
    }

    return <Component {...props} />;
  };
};

/**
 * HOC to protect routes that require specific role(s)
 * @param {React.Component} Component - Component to protect
 * @param {string|string[]} allowedRoles - Role(s) allowed to access
 * @returns {React.Component} Protected component
 */
export const withRole = (Component, allowedRoles) => {
  return function RoleProtectedRoute(props) {
    const { isAuthenticated, hasRole, hasAnyRole, loading, role } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        // Not authenticated - redirect to login
        if (!isAuthenticated()) {
          router.push("/login");
          return;
        }

        // Check if user has required role
        const hasAccess = Array.isArray(allowedRoles)
          ? hasAnyRole(allowedRoles)
          : hasRole(allowedRoles);

        if (!hasAccess) {
          // Redirect based on user's actual role
          if (role === "admin") {
            router.push("/admin");
          } else if (role === "setter") {
            router.push("/setter");
          } else {
            router.push("/contests");
          }
        }
      }
    }, [loading, isAuthenticated, hasRole, hasAnyRole, role, router]);

    // Show loading while checking auth
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      );
    }

    // Don't render if not authenticated or unauthorized
    if (!isAuthenticated()) {
      return null;
    }

    const hasAccess = Array.isArray(allowedRoles)
      ? hasAnyRole(allowedRoles)
      : hasRole(allowedRoles);

    if (!hasAccess) {
      return null;
    }

    return <Component {...props} />;
  };
};

/**
 * HOC to redirect authenticated users away from public pages (like login)
 * @param {React.Component} Component - Component to wrap
 * @returns {React.Component} Wrapped component
 */
export const withGuest = (Component) => {
  return function GuestRoute(props) {
    const { isAuthenticated, loading, role } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && isAuthenticated()) {
        // Redirect based on role
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "setter") {
          router.push("/setter");
        } else {
          router.push("/contests");
        }
      }
    }, [loading, isAuthenticated, role, router]);

    // Show loading while checking auth
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      );
    }

    // Don't render if authenticated
    if (isAuthenticated()) {
      return null;
    }

    return <Component {...props} />;
  };
};
