import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AuthShell from "../components/auth/AuthShell.jsx";
import { resendVerificationRequest } from "../api/auth.js";
import { getAuthErrorMessage, trimFormValues } from "../utils/auth.js";

export default function ResendVerificationPage() {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const initialEmail = useMemo(() => location.state?.email || "", [location.state]);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const sanitizedEmail = trimFormValues({ email }).email;

    if (!sanitizedEmail) {
      setError("Email is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await resendVerificationRequest(sanitizedEmail);
      setHasSubmitted(true);
      toast.success("If the account exists, a verification email has been sent.");
    } catch (requestError) {
      setError(getAuthErrorMessage(requestError, "We could not resend the verification email right now."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Verification Help"
      title="Resend your verification email"
      subtitle="Request a fresh email verification link if the original message expired or never arrived."
      sideTitle="A safe recovery path for pending accounts"
      sideCopy="This flow returns a generic success response so the UI can help real users without exposing account existence details to bad actors."
    >
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              disabled={isSubmitting}
              autoComplete="email"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
              {error}
            </div>
          ) : null}

          {hasSubmitted ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
              If the account exists, a verification email has been sent.
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "Sending..." : "Send verification email"}
          </button>
        </form>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
            Back to login
          </Link>
          <Link to="/signup" className="font-semibold text-slate-700 hover:text-slate-900">
            Create a new account
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
