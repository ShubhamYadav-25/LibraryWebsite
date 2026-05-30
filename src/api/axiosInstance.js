import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://libraryserver-sqve.onrender.com/v1";

/**
 * Main API Client
 */
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

/**
 * Dedicated Refresh Client
 * Prevents interceptor recursion issues.
 */
const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

/**
 * Refresh/Queue State
 */
let isRefreshing = false;
let failedQueue = [];
let hasHandledRefreshFailure = false;

/**
 * Auth Session Hooks
 */
let authSessionHandlers = {
  onRefreshFailure: null,
};

export const setAuthSessionHandlers = (handlers = {}) => {
  authSessionHandlers = {
    ...authSessionHandlers,
    ...handlers,
  };
};

/**
 * Routes that should NEVER trigger refresh logic
 */
const AUTH_EXCLUDED_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/google",
  "/auth/refresh",
  "/auth/verify-email",
  "/auth/resend-verification",
];

/**
 * Helper: Check excluded routes
 */
const isExcludedRoute = (url = "") => {
  try {
    const normalizedUrl = new URL(url, BASE_URL);

    return AUTH_EXCLUDED_ROUTES.some((route) =>
      normalizedUrl.pathname.endsWith(route)
    );
  } catch {
    return AUTH_EXCLUDED_ROUTES.some((route) => url.includes(route));
  }
};

/**
 * Resolve or reject all queued requests
 */
const processQueue = (error = null) => {
  failedQueue.forEach(({ config, resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }

    /**
     * Prevent infinite retry loops
     */
    config._retry = true;

    /**
     * Prevent retrying aborted requests
     */
    if (config.signal?.aborted) {
      reject(new axios.Cancel("Request aborted"));
      return;
    }

    resolve(api(config));
  });

  failedQueue = [];
};

/**
 * Optional request interceptor
 * Useful for future CSRF/header injection.
 */
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor
 */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    /**
     * Network/server unreachable errors
     */
    if (!originalRequest) {
      return Promise.reject(error);
    }

    /**
     * Skip refresh conditions
     */
    const shouldSkipRefresh =
      originalRequest._retry ||
      originalRequest.skipAuthRefresh ||
      isExcludedRoute(originalRequest.url);

    /**
     * Only handle unauthorized errors
     */
    if (status !== 401 || shouldSkipRefresh) {
      return Promise.reject(error);
    }

    /**
     * Prevent memory explosion
     */
    if (failedQueue.length > 100) {
      return Promise.reject(
        new Error("Too many pending authentication requests")
      );
    }

    /**
     * Queue requests while refresh is active
     */
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          config: originalRequest,
          resolve,
          reject,
        });
      });
    }

    /**
     * Start refresh flow
     */
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      /**
       * Refresh session
       */
      await refreshClient.post("/auth/refresh");

      /**
       * Reset failure state after successful refresh
       */
      hasHandledRefreshFailure = false;

      /**
       * IMPORTANT:
       * Reset refreshing BEFORE processing queue
       */
      isRefreshing = false;

      /**
       * Replay queued requests
       */
      processQueue();

      /**
       * Retry original request
       */
      return api(originalRequest);
    } catch (refreshError) {
      /**
       * IMPORTANT:
       * Reset refreshing BEFORE rejecting queue
       */
      isRefreshing = false;

      /**
       * Reject all queued requests
       */
      processQueue(refreshError);

      /**
       * Prevent duplicate logout handling
       */
      if (
        !hasHandledRefreshFailure &&
        typeof authSessionHandlers.onRefreshFailure === "function"
      ) {
        hasHandledRefreshFailure = true;

        try {
          await authSessionHandlers.onRefreshFailure(refreshError);
        } catch (handlerError) {
          console.error(
            "Refresh failure handler error:",
            handlerError
          );
        }
      }

      return Promise.reject(refreshError);
    }
  }
);

export default api;
