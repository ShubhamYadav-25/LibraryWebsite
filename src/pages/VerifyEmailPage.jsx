import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell.jsx";
import { verifyEmailRequest } from "../api/auth.js";
import { getAuthErrorMessage } from "../utils/auth.js";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token")?.trim() || "", [searchParams]);
  const [status, setStatus] = useState(token ? "loading" : "error");
  const [message, setMessage] = useState(token ? "Verifying your email..." : "Missing verification token.");

  useEffect(() => {
    if (!token) {
      return;
    }

    let active = true;

    const verify = async () => {
      try {
        const response = await verifyEmailRequest(token);

        if (!active) {
          return;
        }

        setStatus("success");
        setMessage(response?.message || "Email verified successfully.");

        window.setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1800);
      } catch (error) {
        if (!active) {
          return;
        }

        setStatus("error");
        setMessage(getAuthErrorMessage(error, "This verification link is invalid or expired."));
      }
    };

    verify();

    return () => {
      active = false;
    };
  }, [navigate, token]);

  return (
    <AuthShell
      eyebrow="Email Verification"
      title={status === "success" ? "Email verified" : status === "loading" ? "Verifying your email" : "Verification failed"}
      subtitle={message}
      sideTitle="Verification keeps account ownership clear"
      sideCopy="A verified address is required before local sign-in starts. If the link expired, you can request a fresh one without exposing whether an account exists."
    >
      <div className="space-y-4">
        <div className={`rounded-3xl border px-5 py-6 text-sm ${status === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-950" : status === "loading" ? "border-sky-200 bg-sky-50 text-sky-950" : "border-amber-200 bg-amber-50 text-amber-950"}`}>
          {status === "loading" ? "Please wait while we confirm your verification token." : message}
        </div>

        {status === "success" ? (
          <p className="text-sm text-slate-600">Redirecting you to sign in...</p>
        ) : null}

        {status === "error" ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/resend-verification"
              className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Resend verification email
            </Link>
            <Link
              to="/login"
              className="rounded-2xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50"
            >
              Back to login
            </Link>
          </div>
        ) : null}
      </div>
    </AuthShell>
  );
}
