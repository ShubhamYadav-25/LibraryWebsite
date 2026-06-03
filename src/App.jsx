import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { AuthProvider } from "./context/AuthProvider.jsx";
import ProtectedRoute from "./components/protectedroutes.jsx";

import UserLayout from "./components/UserLayout.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import { Navigate } from "react-router-dom";
import AuthLoading from './components/AuthLoading.jsx';
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const AboutPage = lazy(() => import("./pages/AboutPage.jsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.jsx"));
const Dashboard = lazy(() => import("./pages/DashboardPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const SignUpPage = lazy(() => import("./pages/SignupPage.jsx"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage.jsx"));
const ResendVerificationPage = lazy(() => import("./pages/ResendVerificationPage.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"));
const RequestBookPage = lazy(() => import("./pages/RequestBookPage.jsx"));
const BookDetailPage = lazy(() => import("./pages/BookDetailPage.jsx"));
const ReturnBooksPage = lazy(() => import("./pages/ReturnPage.jsx"));
const ViewBooksPage = lazy(() => import("./pages/ViewBooksPage.jsx"));
const SearchBookPage = lazy(() => import("./pages/SearchBookPage.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const IssueReturnPage = lazy(() => import("./pages/Issue&ReturnPage.jsx"));
const BookCatalogPage = lazy(() => import("./pages/BookCatalog.jsx"));
const UsersPage = lazy(() => import("./pages/UsersPage.jsx"));
const ReportsPage = lazy(() => import("./pages/ReportsPage.jsx"));
const SettingsPage = lazy(() => import("./pages/Settings.jsx"));
const FinesPaymentsPage = lazy(() => import("./pages/FinePaymentsPage.jsx"));

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="bottom-right" autoClose={3000} />

        <Suspense fallback={<AuthLoading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/auth" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/resend-verification" element={<ResendVerificationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["student", "staff"]}>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/requestbook" element={<RequestBookPage />} />
            <Route path="/books" element={<ViewBooksPage />} />
            <Route path="/returnbook" element={<ReturnBooksPage />} />
            <Route path="/bookdetail" element={<BookDetailPage />} />
            <Route path="/searchbook" element={<SearchBookPage />} />
            <Route path="/finepayments" element={<FinesPaymentsPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={["admin", "librarian"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/requests" element={<IssueReturnPage />} />
            <Route path="/catalog" element={<BookCatalogPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
