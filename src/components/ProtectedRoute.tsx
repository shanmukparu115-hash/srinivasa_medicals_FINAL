// ============================================================
// ProtectedRoute.tsx — Route guard with role-based access
// ============================================================
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Required role. If omitted, just requires login. */
  role?: "customer" | "admin";
  /** Where to redirect if not authenticated */
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  role,
  redirectTo,
}) => {
  const { isAuthenticated, isAdmin, isCustomer } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const loginPath = role === "admin" ? "/admin/login" : "/login";
    return <Navigate to={redirectTo ?? loginPath} state={{ from: location }} replace />;
  }

  if (role === "admin" && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (role === "customer" && !isCustomer) {
    // Admin landed on customer-only page → redirect to admin dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};
