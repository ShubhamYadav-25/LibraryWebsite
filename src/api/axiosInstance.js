import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];
let authSessionHandlers = {
  onRefreshFailure: null,
};

export const setAuthSessionHandlers = (handlers = {}) => {
  authSessionHandlers = {
    ...authSessionHandlers,
    ...handlers,
  };
};

const processQueue = (error) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
      return;
    }

    request.resolve(api(request.config));
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const shouldSkipRefresh =
      originalRequest._retry ||
      originalRequest.skipAuthRefresh ||
      originalRequest.url?.includes("/auth/refresh");

    if (status !== 401 || shouldSkipRefresh) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          config: originalRequest,
          reject,
          resolve,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post(
        "/auth/refresh",
        {},
        {
          withCredentials: true,
          skipAuthRefresh: true,
        }
      );

      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      if (typeof authSessionHandlers.onRefreshFailure === "function") {
        await authSessionHandlers.onRefreshFailure(refreshError);
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
