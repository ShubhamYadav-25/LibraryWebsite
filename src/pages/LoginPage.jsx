import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axiosInstance.js";
import AuthLoading from "../components/AuthLoading.jsx";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useAuth } from "../context/AuthProvider.jsx";

const getCSRFToken = async () => {
  const response = await api.get("/auth/csrf-token", {
    withCredentials: true,
  });

  if (response.status !== 200) {
    throw new Error("Failed to get CSRF token");
  }

  return response.data.csrfToken;
};

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { authLoading, isAuth, login, user } = useAuth();

  const initialMode =
    searchParams.get("mode") === "register" ? "register" : "login";
  const initialRole = searchParams.get("role") || "user";

  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const nextMode = searchParams.get("mode");
    const nextRole = searchParams.get("role");

    if (nextMode === "login" || nextMode === "register") {
      setMode(nextMode);
    }

    if (nextRole === "user" || nextRole === "admin") {
      setRole(nextRole);
    }
  }, [searchParams]);

  useEffect(() => {
    if (authLoading || !isAuth) {
      return;
    }

    navigate(user?.studentId ? "/dashboard" : "/admindashboard", {
      replace: true,
    });
  }, [authLoading, isAuth, navigate, user]);

  if (loading) {
    return <AuthLoading />;
  }

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Missing credentials");
      }

      const csrfToken = await getCSRFToken();
      const user = await login({
        csrfToken,
        email: formData.email,
        password: formData.password,
        role,
      });

      navigate(user.studentId ? "/dashboard" : "/admindashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const csrfToken = await getCSRFToken();
      const response = await api.post(
        "/auth/register",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: "Student",
        },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.status !== 201) {
        throw new Error("Registration failed");
      }

      toast.success(`${role} account created successfully`);

      const newMode = "login";
      setMode(newMode);
      navigate(`/auth?mode=${newMode}&role=${role}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex min-h-[90vh]">
        <div className="hidden lg:flex w-1/2 bg-white items-center justify-center p-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Your Smart Digital <span className="text-teal-500">Library</span>
            </h1>
            <p className="mt-4 text-gray-600 max-w-md">
              Manage books, students, and borrowing seamlessly with a modern
              system.
            </p>

            <img
              src="/library.jpg"
              alt="Library"
              className="mt-6 rounded-xl shadow-md"
            />
          </div>
        </div>

        <div className="flex w-full lg:w-1/2 items-center justify-center px-6">
          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
            <div className="flex justify-center gap-3 mb-6">
              {["user", "admin"].map((nextRole) => (
                <button
                  key={nextRole}
                  disabled={loading}
                  onClick={() => {
                    setRole(nextRole);
                    navigate(`/auth?mode=${mode}&role=${nextRole}`);
                  }}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                    role === nextRole
                      ? "bg-teal-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {nextRole.toUpperCase()}
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-center">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>

            <p className="text-center text-gray-500 text-sm mb-6">
              {mode === "login" ? `Login as ${role}` : `Register as ${role}`}
            </p>

            {loading ? (
              <AuthLoading />
            ) : (
              <form
                onSubmit={mode === "login" ? handleLogin : handleRegister}
                className="flex flex-col gap-4"
              >
                {mode === "register" && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      name="firstName"
                      placeholder="First Name"
                      onChange={handleChange}
                      required
                      className="border p-2 rounded-md"
                    />
                    <input
                      name="lastName"
                      placeholder="Last Name"
                      onChange={handleChange}
                      required
                      className="border p-2 rounded-md"
                    />
                  </div>
                )}

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="border p-2 rounded-md"
                />

                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="border p-2 rounded-md"
                />

                {mode === "register" && (
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className="border p-2 rounded-md"
                  />
                )}

                {mode === "register" && (
                  <div className="flex items-center text-sm">
                    <input type="checkbox" required className="mr-2" />
                    <span>I agree to Terms & Conditions</span>
                  </div>
                )}

                <button
                  disabled={loading}
                  className={`py-2 rounded-md text-white transition ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-teal-500 hover:bg-teal-600"
                  }`}
                >
                  {loading
                    ? "Please wait..."
                    : mode === "login"
                      ? "Sign In"
                      : "Create Account"}
                </button>
              </form>
            )}

            <p className="text-center text-sm mt-6 text-gray-600">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <span
                onClick={() => {
                  const nextMode = mode === "login" ? "register" : "login";
                  setMode(nextMode);
                  navigate(`/auth?mode=${nextMode}&role=${role}`);
                }}
                className="text-teal-500 cursor-pointer ml-1 font-medium"
              >
                {mode === "login" ? "Register" : "Login"}
              </span>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
