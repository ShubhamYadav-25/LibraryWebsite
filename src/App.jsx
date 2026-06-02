import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { AuthProvider } from "./context/AuthProvider.jsx";
import ProtectedRoute from "./components/protectedroutes.jsx";

import UserLayout from "./components/UserLayout.jsx";
import AdminLayout from "./components/AdminLayout.jsx";

import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import Dashboard from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignupPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import ResendVerificationPage from "./pages/ResendVerificationPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RequestBookPage from "./pages/RequestBookPage.jsx";
import BookDetailPage from "./pages/BookDetailPage.jsx";
import ReturnBooksPage from "./pages/ReturnPage.jsx";
import ViewBooksPage from "./pages/ViewBooksPage.jsx";
import SearchBookPage from "./pages/SearchBookPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import IssueReturnPage from "./pages/Issue&ReturnPage.jsx";
import BookCatalogPage from "./pages/BookCatalog.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import SettingsPage from "./pages/Settings.jsx";
import FinesPaymentsPage from "./pages/FinePaymentsPage.jsx";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="bottom-right" autoClose={3000} />

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
      </Router>
    </AuthProvider>
  );
}

export default App;
