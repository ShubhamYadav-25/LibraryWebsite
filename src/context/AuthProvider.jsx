import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api, { setAuthSessionHandlers } from "../api/axiosInstance";

const AuthContext = createContext();

const createAdminIdentity = () => ({
  id: "admin-session",
  role: "admin",
  name: "Administrator",
});

const normalizeUser = (data, fallbackRole) => {
  if (!data || typeof data !== "object") {
    return fallbackRole === "admin" ? createAdminIdentity() : null;
  }

  if (data.studentId || data.student_id) {
    return data;
  }

  if (String(data.role || "").toLowerCase() === "admin" || fallbackRole === "admin") {
    return {
      ...createAdminIdentity(),
      ...data,
      role: "admin",
      name: data.name || data.fullName || "Administrator",
    };
  }

  return data;
};

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const clearAuth = useCallback(() => {
    setIsAuth(false);
    setUser(null);
  }, []);

  const loadCurrentUser = useCallback(async (fallbackRole) => {
    try {
      const response = await api.get("/users/me", {
        withCredentials: true,
      });

      return normalizeUser(response.data, fallbackRole);
    } catch (userError) {
      if (userError.response?.status === 401) {
        throw userError;
      }

      try {
        await api.get("/admin/stats", {
          withCredentials: true,
        });

        return createAdminIdentity();
      } catch (adminError) {
        throw adminError;
      }
    }
  }, []);

  const refreshSession = useCallback(
    async (options = {}) => {
      const { fallbackRole, updateLoading = false } = options;

      if (updateLoading) {
        setAuthLoading(true);
      }

      try {
        await api.post(
          "/auth/refresh",
          {},
          {
            withCredentials: true,
            skipAuthRefresh: true,
          }
        );

        const currentUser = await loadCurrentUser(fallbackRole);
        setUser(currentUser);
        setIsAuth(true);
        return currentUser;
      } catch (error) {
        clearAuth();
        throw error;
      } finally {
        if (updateLoading) {
          setAuthLoading(false);
        }
      }
    },
    [clearAuth, loadCurrentUser]
  );

  const login = useCallback(
    async ({ email, password, role, csrfToken }) => {
      await api.post(
        "/auth/login",
        {
          email,
          password,
          role,
        },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        }
      );

      const currentUser = await loadCurrentUser(role);
      setUser(currentUser);
      setIsAuth(true);
      return currentUser;
    },
    [loadCurrentUser]
  );

  const logout = useCallback(async () => {
    try {
      await api.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  useEffect(() => {
    setAuthSessionHandlers({
      onRefreshFailure: clearAuth,
    });

    return () => {
      setAuthSessionHandlers({
        onRefreshFailure: null,
      });
    };
  }, [clearAuth]);

  useEffect(() => {
    let mounted = true;

    const bootstrapAuth = async () => {
      setAuthLoading(true);

      try {
        await refreshSession();
      } catch (error) {
        if (mounted) {
          clearAuth();
        }
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    };

    bootstrapAuth();

    return () => {
      mounted = false;
    };
  }, [clearAuth, refreshSession]);

  return (
    <AuthContext.Provider
      value={{
        authLoading,
        clearAuth,
        isAuth,
        login,
        logout,
        refreshSession,
        setUser,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
