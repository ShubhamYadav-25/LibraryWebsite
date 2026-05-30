import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthShell from "../components/auth/AuthShell.jsx";
import GoogleSignInButton from "../components/auth/GoogleSignInButton.jsx";
import { signupRequest, resendVerificationRequest } from "../api/auth.js";
import { useAuth } from "../context/AuthProvider.jsx";
import { getAuthErrorMessage, getUserHomeRoute, trimFormValues } from "../utils/auth.js";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const roleOptions = [
  { value: "Student", label: "Student" },
  { value: "Admin", label: "Admin" },
  { value: "Librarian", label: "Librarian" },
  { value: "Staff", label: "Staff" },
];

const validateSignupForm = ({ firstName, lastName, email, password, confirmPassword }) => {
  const errors = {};

  if (!firstName) {
    errors.firstName = "First name is required.";
  }

  if (!lastName) {
    errors.lastName = "Last name is required.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

export default function SignUpPage() {
  const navigate = useNavigate();
  const { isAuth, loginWithGoogle, user } = useAuth();

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [hasSentVerification, setHasSentVerification] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Student");

  const trimmedEmail = useMemo(() => formData.email.trim(), [formData.email]);

  if (isAuth) {
    return <Navigate to={getUserHomeRoute(user)} replace />;
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
    const nextErrors = validateSignupForm(sanitized);

    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await signupRequest({
        firstName: sanitized.firstName,
        lastName: sanitized.lastName,
        email: sanitized.email,
        password: sanitized.password,
        role: selectedRole,
      });

      setVerificationEmail(sanitized.email);
      setHasSentVerification(true);
      toast.success("Verification email sent.");
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error, "Sign up failed. Please try again."));
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
      setSubmitError(getAuthErrorMessage(error, "Google sign-up failed. Please try again."));
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleResend = async () => {
    const emailToUse = verificationEmail || trimmedEmail;

    if (!emailToUse) {
      setErrors((current) => ({
        ...current,
        email: "Enter your email address first.",
      }));
      return;
    }

    setIsResending(true);

    try {
      await resendVerificationRequest(emailToUse);
      toast.success("If the account exists, a verification email has been sent.");
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error, "We could not resend the verification email right now."));
    } finally {
      setIsResending(false);
    }
  };

  if (hasSentVerification) {
    return (
      <AuthShell
        eyebrow="Verify Email"
        title="Check your email to verify your account."
        subtitle="We sent a verification link to your inbox. Open the email, verify your address, then come back to sign in."
        sideTitle="Your account is created, but not active yet"
        sideCopy="New signups stay unverified until the email link is completed. This keeps password sign-in and Google account linking safer from the start."
      >
        <div className="space-y-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-950">
          <p>
            Verification email sent to <span className="font-semibold">{verificationEmail}</span>.
          </p>
          <p>Use the verification link before attempting to sign in.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isResending ? "Sending..." : "Resend verification email"}
            </button>
            <Link
              to="/login"
              state={{ email: verificationEmail }}
              className="rounded-2xl border border-slate-300 px-4 py-3 text-center font-semibold text-slate-700 transition hover:border-emerald-400 hover:bg-white"
            >
              Back to sign in
            </Link>
          </div>
          <p className="text-xs text-emerald-900/80">
            Didn&apos;t receive it? Check spam or request another message.
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Create Account"
      title="Join LibraryMS"
      subtitle="Create your student account, verify your email, and then sign in. We do not log users in automatically after signup anymore."
    >
      <div className="space-y-2">
        <div className="mr-3 ml-3">
          <label
            htmlFor="signup-role"
            className="text-sm font-bold uppercase tracking-[0.1em] text-slate-500"
          >
            Choose role
          </label>
          <select
            id="signup-role"
            value={selectedRole}
            onChange={(event) => setSelectedRole(event.target.value)}
            disabled={isSubmitting || isGoogleSubmitting}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
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
          label="Continue with Google"
          onCredential={handleGoogleCredential}
        />

        <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          or create with email
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="mb-1 block text-md font-semibold text-slate-700 pl-1">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isSubmitting || isGoogleSubmitting}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
              />
              {errors.firstName ? <p className="mt-2 text-sm text-rose-600">{errors.firstName}</p> : null}
            </div>
            <div>
              <label htmlFor="lastName" className="mb-1 block text-md font-semibold text-slate-700 pl-1">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isSubmitting || isGoogleSubmitting}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
              />
              {errors.lastName ? <p className="mt-2 text-sm text-rose-600">{errors.lastName}</p> : null}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-md font-semibold text-slate-700 pl-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
            />
            {errors.email ? <p className="mt-2 text-sm text-rose-600">{errors.email}</p> : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="password" className="mb-1 block text-md font-semibold text-slate-700 pl-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={isSubmitting || isGoogleSubmitting}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
              />
              {errors.password ? <p className="mt-2 text-sm text-rose-600">{errors.password}</p> : null}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-md font-semibold text-slate-700 pl-1">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={isSubmitting || isGoogleSubmitting}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
              />
              {errors.confirmPassword ? <p className="mt-2 text-sm text-rose-600">{errors.confirmPassword}</p> : null}
            </div>
          </div>

          {submitError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
              {submitError}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || isGoogleSubmitting}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "Creating your account..." : "Create account"}
          </button>
        </form>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
            Already have an account?
          </Link>
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || isSubmitting || isGoogleSubmitting}
            className="font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isResending ? "Sending..." : "Resend verification"}
          </button>
        </div>
      </div>
    </AuthShell>
  );
}
