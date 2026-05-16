import { Navigate, useLocation } from "react-router-dom";

import AuthLoading from "./AuthLoading";

import { useAuth } from "../context/AuthProvider";

import {
  getUserHomeRoute,
  getUserRole,
} from "../utils/auth";

const ProtectedRoute = ({
  allowedRoles = [],
  children,
}) => {
  const location = useLocation();

  const {
    authLoading,
    isAuth,
    user,
  } = useAuth();

  /**
   * Block ALL routing while auth bootstraps
   */
  if (authLoading) {
    return <AuthLoading />;
  }

  /**
   * Unauthenticated
   */
  if (!isAuth) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  /**
   * Role-based protection
   */
  if (allowedRoles.length > 0) {
    /**
     * Normalize role safely
     */
    const role = (
      getUserRole(user) ||
      (user?.studentId || user?.student_id
        ? "student"
        : "")
    )
      .toLowerCase()
      .trim();

    const normalizedAllowedRoles = allowedRoles.map(
      (value) => value.toLowerCase().trim()
    );

    /**
     * Prevent premature redirects
     * if user object is not fully hydrated yet
     */
    if (!role) {
      return <AuthLoading />;
    }

    /**
     * Unauthorized role
     */
    if (!normalizedAllowedRoles.includes(role)) {
      const fallbackRoute = getUserHomeRoute(user);

      /**
       * Prevent redirect loops
       */
      if (fallbackRoute === location.pathname) {
        return <Navigate to="/unauthorized" replace />;
      }

      return (
        <Navigate
          to={fallbackRoute}
          replace
        />
      );
    }
  }

  return children;
};

export default ProtectedRoute;