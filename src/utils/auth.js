export const trimFormValues = (values) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value,
    ])
  );

export const getUserRole = (user) => String(user?.role || user?.roles || "").toLowerCase();

export const isStaffRole = (user) => ["admin", "librarian", "staff"].includes(getUserRole(user));

export const isStudentUser = (user) => Boolean(user?.studentId || user?.student_id);

export const normalizeUser = (user) => {
  const rawUser = user && typeof user === "object" && user.user ? user.user : user;

  if (!rawUser || typeof rawUser !== "object") {
    return null;
  }

  const normalizedRole = rawUser.role || rawUser.roles;

  return normalizedRole
    ? {
        ...rawUser,
        role: normalizedRole,
      }
    : rawUser;
};

export const getUserHomeRoute = (user) => (isStaffRole(user) ? "/admindashboard" : "/dashboard");

export const getDefaultAuthErrorMessage = () => "Invalid email or password.";

export const getAuthErrorMessage = (error, fallbackMessage) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error?.message ||
    error?.message ||
    fallbackMessage;

  return typeof message === "string" ? message : fallbackMessage;
};

export const isVerificationRelatedError = (error) => {
  const message = getAuthErrorMessage(error, "").toLowerCase();
  return message.includes("verify") || message.includes("verification") || message.includes("unverified");
};
