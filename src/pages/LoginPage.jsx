import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLoading from "../components/AuthLoading.jsx";
import AuthShell from "../components/auth/AuthShell.jsx";
import GoogleSignInButton from "../components/auth/GoogleSignInButton.jsx";
import { useAuth } from "../context/AuthProvider.jsx";
import {
  getAuthErrorMessage,
  getDefaultAuthErrorMessage,
  getUserHomeRoute,
  isStaffRole,
  isVerificationRelatedError,
  trimFormValues,
} from "../utils/auth.js";

const initialState = {
  email: "",
  password: "",
};

const roleOptions = [
  { value: "Student", label: "Student" },
  { value: "Admin", label: "Admin" },
  { value: "Librarian", label: "Librarian" },
  { value: "Staff", label: "Staff" },
];

const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  return errors;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authLoading, isAuth, isStudent, login, loginWithGoogle, user } = useAuth();

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Student");

  const redirectTarget = useMemo(() => {
    if (isStaffRole(user)) {
      return "/admindashboard";
    }

    if (isStudent) {
      return "/dashboard";
    }

    return "/dashboard";
  }, [isStudent, user]);

  useEffect(() => {
    const emailFromState = location.state?.email;
    if (emailFromState) {
      setFormData((current) => ({
        ...current,
        email: emailFromState,
      }));
    }
  }, [location.state]);

  if (authLoading || isAuth === null) {
    return <AuthLoading />;
  }

  if (isAuth) {
    return <Navigate to={redirectTarget} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const sanitized = trimFormValues(formData);
    const nextErrors = validateLoginForm(sanitized);

    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const currentUser = await login({
        email: sanitized.email,
        password: sanitized.password,
        role: selectedRole,
      });

      toast.success("Signed in successfully.");
      navigate(getUserHomeRoute(currentUser), {
        replace: true,
      });
    } catch (error) {
      const status = error?.response?.status;
      const fallbackMessage =
        status === 429
          ? getAuthErrorMessage(error, "Too many attempts. Please try again later.")
          : isVerificationRelatedError(error)
            ? "Your account needs email verification before you can sign in."
            : getDefaultAuthErrorMessage();
      const message = status === 429 ? fallbackMessage : fallbackMessage;

      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleCredential = async (idToken) => {
    setSubmitError("");
    setIsGoogleSubmitting(true);

    try {
      const currentUser = await loginWithGoogle({
        idToken,
        role: selectedRole,
      });
      toast.success("Signed in with Google.");
      navigate(getUserHomeRoute(currentUser), {
        replace: true,
      });
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error, "Google sign-in failed. Please try again."));
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome Back"
      title="Sign in to your library account"
      subtitle="Use your email and password or continue with Google."
    >
      <div className="space-y-2">
        <div className="ml-3 mr-3">
          <label
            htmlFor="login-role"
            className="text-sm font-bold uppercase tracking-[0.1em] text-slate-500"
          >
            Login as
          </label>
          <select
            id="login-role"
            value={selectedRole}
            onChange={(event) => setSelectedRole(event.target.value)}
            disabled={isSubmitting || isGoogleSubmitting}
            className="flex w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <GoogleSignInButton
          busy={isGoogleSubmitting}
          disabled={isSubmitting}
          onCredential={handleGoogleCredential}
        />

        <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          or use email
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div >
            <div className="mb-1 flex items-center justify-between">
            <label htmlFor="email" className="mb-1 block text-md font-semibold text-slate-700 pl-1">
              Email address
            </label>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
              placeholder="you@example.com"
            />
            {errors.email ? <p className="mt-2 text-sm text-rose-600">{errors.email}</p> : null}
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="password" className="block text-md font-semibold text-slate-700 pl-1">
                Password
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
              placeholder="Enter your password"
            />
            {errors.password ? <p className="mt-2 text-sm text-rose-600">{errors.password}</p> : null}
          </div>

          {submitError ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p>{submitError}</p>
              <p className="mt-2">
                Need a new verification email?{" "}
                <Link
                  to="/resend-verification"
                  state={{ email: formData.email.trim() }}
                  className="font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Request one here.
                </Link>
              </p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || isGoogleSubmitting}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "Signing you in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-semibold text-emerald-700 hover:text-emerald-800">
            Create one
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
