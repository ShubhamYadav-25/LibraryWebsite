import axios from "axios";

// ✅ Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

// 🔁 Refresh control
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve();
  });
  failedQueue = [];
};

// ✅ RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(originalRequest)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 🔁 Refresh token
        await axios.post(
          "http://localhost:5000/api/refresh-token",
          {},
          { withCredentials: true }
        );

        processQueue(null);

        return api(originalRequest); // retry original request

      } catch (err) {
        processQueue(err);

        // ❌ logout fallback
        window.location.href = "/login";

        return Promise.reject(err);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;