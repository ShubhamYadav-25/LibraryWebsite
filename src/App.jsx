import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// ✅ Correct imports
import { AuthProvider } from "./context/AuthProvider.jsx";
import ProtectedRoute from "./components/protectedroutes.jsx";

import UserLayout from "./components/UserLayout.jsx";
import AdminLayout from "./components/AdminLayout.jsx";

// Pages
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import Dashboard from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignupPage.jsx";
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="bottom-right" autoClose={3000} />

        <Routes>
          {/* ✅ Public Routes (no auth check) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/auth" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* ✅ User Protected Routes */}
          <Route element={<UserLayout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requestbook"
              element={
                <ProtectedRoute>
                  <RequestBookPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <ViewBooksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/returnbook"
              element={
                <ProtectedRoute>
                  <ReturnBooksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookdetail"
              element={
                <ProtectedRoute>
                  <BookDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/searchbook"
              element={
                <ProtectedRoute>
                  <SearchBookPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/finepayments"
              element={
                <ProtectedRoute>
                  <FinesPaymentsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ⚠️ Admin routes (you can later add AdminProtectedRoute) */}
          <Route element={<AdminLayout />}>
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/requests" element={<IssueReturnPage />} />
            <Route path="/catalog" element={<BookCatalogPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;