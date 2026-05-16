import api from "./axiosInstance";

export const signupRequest = async (payload) => {
  const response = await api.post("/auth/register", payload, {
    skipAuthRefresh: true,
  });

  return response.data;
};

export const loginRequest = async (payload) => {
  const response = await api.post("/auth/login", payload, {
    skipAuthRefresh: true,
  });

  return response.data;
};

export const googleLoginRequest = async ({ idToken, role }) => {
  const response = await api.post(
    "/auth/google",
    {
      idToken,
      ...(role ? { role } : {}),
    },
    {
      skipAuthRefresh: true,
    }
  );

  return response.data;
};

export const logoutRequest = async () => {
  const response = await api.post("/auth/logout", {}, { withCredentials: true });
  return response.data;
};

export const refreshSessionRequest = async () => {
  const response = await api.post(
    "/auth/refresh",
    {},
    {
      withCredentials: true,
      skipAuthRefresh: true,
    }
  );

  return response.data;
};

export const fetchCurrentUserRequest = async () => {
  const response = await api.get("/users/me", {
    withCredentials: true,
  });

  return response.data?.user ?? response.data;
};

export const verifyEmailRequest = async (token) => {
  try {
    const response = await api.post(
      "/auth/verify-email",
      { token },
      {
        skipAuthRefresh: true,
      }
    );

    return response.data;
  } catch (error) {
    const shouldFallbackToGet = error.response?.status === 404 || error.response?.status === 405;

    if (!shouldFallbackToGet) {
      throw error;
    }

    const response = await api.get("/auth/verify-email", {
      params: { token },
      skipAuthRefresh: true,
    });

    return response.data;
  }
};

export const resendVerificationRequest = async (email) => {
  const response = await api.post(
    "/auth/resend-verification",
    { email },
    {
      skipAuthRefresh: true,
    }
  );

  return response.data;
};
