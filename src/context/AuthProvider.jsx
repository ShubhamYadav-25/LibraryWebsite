/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { setAuthSessionHandlers } from "../api/axiosInstance";

import {
  fetchCurrentUserRequest,
  googleLoginRequest,
  loginRequest,
  logoutRequest,
} from "../api/auth";

import {
  getUserRole,
  isStaffRole,
  isStudentUser,
  normalizeUser,
} from "../utils/auth";

const AuthContext = createContext(null);

/**
 * Auth Status Enum
 */
const AUTH_STATUS = {
  LOADING: "loading",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
};

export const AuthProvider = ({ children }) => {
  /**
   * Core State
   */
  const [authStatus, setAuthStatus] = useState(AUTH_STATUS.LOADING);
  const [user, setUser] = useState(null);

  /**
   * Refs
   */
  const mountedRef = useRef(false);
  const authRequestIdRef = useRef(0);

  /**
   * Cross-tab session sync
   */
  const broadcastChannelRef = useRef(null);

  /**
   * Helpers
   */
  const isAuth = authStatus === AUTH_STATUS.AUTHENTICATED;
  const authLoading = authStatus === AUTH_STATUS.LOADING;

  /**
   * Safely update auth state
   */
  const applyAuthenticatedState = useCallback((nextUser) => {
    if (!mountedRef.current) {
      return;
    }

    setUser(nextUser);
    setAuthStatus(AUTH_STATUS.AUTHENTICATED);
  }, []);

  /**
   * Clear auth state
   */
  const clearAuth = useCallback(() => {
    if (!mountedRef.current) {
      return;
    }

    setUser(null);
    setAuthStatus(AUTH_STATUS.UNAUTHENTICATED);
  }, []);

  /**
   * Load current user
   */
  const loadCurrentUser = useCallback(async () => {
    const currentUser = await fetchCurrentUserRequest();
    return normalizeUser(currentUser);
  }, []);

  /**
   * Prevent stale async overwrites
   */
  const createRequestGuard = () => {
    const requestId = ++authRequestIdRef.current;

    return () =>
      mountedRef.current && requestId === authRequestIdRef.current;
  };

  /**
   * Establish authenticated session
   */
  const establishSession = useCallback(async () => {
    const isLatestRequest = createRequestGuard();

    const currentUser = await loadCurrentUser();

    if (!isLatestRequest()) {
      return null;
    }

    applyAuthenticatedState(currentUser);

    return currentUser;
  }, [applyAuthenticatedState, loadCurrentUser]);

  /**
   * Login
   */
  const login = useCallback(
    async ({ email, password, role }) => {
      const isLatestRequest = createRequestGuard();

      const response = await loginRequest({
        email,
        password,
        role,
      });

      /**
       * Prefer backend-returned user
       */
      const normalizedUser = normalizeUser(response?.user);

      if (!isLatestRequest()) {
        return null;
      }

      applyAuthenticatedState(normalizedUser);

      /**
       * Optional hydration:
       * Only fetch again if backend returns partial user
       */
      if (!normalizedUser?.email || !normalizedUser?.role) {
        establishSession().catch((error) => {
          if (import.meta.env.DEV) {
            console.error("Session hydration failed:", error);
          }
        });
      }

      /**
       * Notify other tabs
       */
      broadcastChannelRef.current?.postMessage({
        type: "AUTH_LOGIN",
      });

      return normalizedUser;
    },
    [applyAuthenticatedState, establishSession]
  );

  /**
   * Google Login
   */
  const loginWithGoogle = useCallback(
    async ({ idToken, role }) => {
      const isLatestRequest = createRequestGuard();

      const response = await googleLoginRequest({
        idToken,
        role,
      });

      const normalizedUser = normalizeUser(response?.user);

      if (!isLatestRequest()) {
        return null;
      }

      applyAuthenticatedState(normalizedUser);

      /**
       * Optional hydration
       */
      if (!normalizedUser?.email || !normalizedUser?.role) {
        establishSession().catch((error) => {
          if (import.meta.env.DEV) {
            console.error("Google session hydration failed:", error);
          }
        });
      }

      /**
       * Notify other tabs
       */
      broadcastChannelRef.current?.postMessage({
        type: "AUTH_LOGIN",
      });

      return normalizedUser;
    },
    [applyAuthenticatedState, establishSession]
  );

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    /**
     * Invalidate all pending auth requests
     */
    authRequestIdRef.current++;

    try {
      await logoutRequest();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Logout failed:", error);
      }
    } finally {
      clearAuth();

      /**
       * Notify other tabs
       */
      broadcastChannelRef.current?.postMessage({
        type: "AUTH_LOGOUT",
      });
    }
  }, [clearAuth]);

  /**
   * Axios refresh failure hook
   */
  useEffect(() => {
    const handleRefreshFailure = async () => {
      authRequestIdRef.current++;

      clearAuth();

      broadcastChannelRef.current?.postMessage({
        type: "AUTH_LOGOUT",
      });
    };

    setAuthSessionHandlers({
      onRefreshFailure: handleRefreshFailure,
    });

    return () => {
      setAuthSessionHandlers({
        onRefreshFailure: null,
      });
    };
  }, [clearAuth]);

  /**
   * Bootstrap Auth
   *
   * IMPORTANT:
   * Do NOT manually call refresh here.
   * Axios interceptor already handles refresh logic.
   */
  useEffect(() => {
    mountedRef.current = true;

    const bootstrapAuth = async () => {
      const isLatestRequest = createRequestGuard();

      setAuthStatus(AUTH_STATUS.LOADING);

      try {
        const currentUser = await loadCurrentUser();

        if (!isLatestRequest()) {
          return;
        }

        applyAuthenticatedState(currentUser);
      } catch {
        if (!isLatestRequest()) {
          return;
        }

        clearAuth();
      }
    };

    bootstrapAuth();

    return () => {
      mountedRef.current = false;

      /**
       * Cancel stale async updates
       */
      authRequestIdRef.current++;
    };
  }, [applyAuthenticatedState, clearAuth, loadCurrentUser]);

  /**
   * Cross-tab auth synchronization
   */
  useEffect(() => {
    const channel = new BroadcastChannel("auth_channel");

    broadcastChannelRef.current = channel;

    channel.onmessage = (event) => {
      const { type } = event.data || {};

      /**
       * Another tab logged out
       */
      if (type === "AUTH_LOGOUT") {
        authRequestIdRef.current++;
        clearAuth();
      }

      /**
       * Another tab logged in
       */
      if (type === "AUTH_LOGIN") {
        establishSession().catch(() => {});
      }
    };

    return () => {
      channel.close();
    };
  }, [clearAuth, establishSession]);

  /**
   * Context Value
   */
  const value = useMemo(
    () => ({
      authLoading,
      authStatus,

      isAuth,

      isAdmin: getUserRole(user) === "admin",
      isStaff: isStaffRole(user),
      isStudent: isStudentUser(user),

      user,

      login,
      loginWithGoogle,
      logout,

      clearAuth,
    }),
    [
      authLoading,
      authStatus,
      isAuth,
      user,
      login,
      loginWithGoogle,
      logout,
      clearAuth,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Safe Auth Hook
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};