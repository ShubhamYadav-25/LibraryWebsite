import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  BookOpen,
  LogOut,
  Plus,
  RotateCcw,
  Search,
  User,
  Wallet,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import Footer from "./Footer.jsx";
import useLogout from "../hooks/Logout";
import { useAuth } from "../context/AuthProvider";

const UserHeader = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useAuth();

  const displayName = user?.name || "User";
  const initials = displayName
    .split(" ")
    .map((namePart) => namePart[0])
    .join("")
    .toUpperCase();

  const fetchNotifications = async () => {
    try {
      setNotifications([]);
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-teal-100 px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-poppins font-bold bg-gradient-to-r from-teal-700 to-blue-700 bg-clip-text text-transparent">
            Library Management
          </h1>
        </div>

        <div className="flex items-center space-x-4 relative">
          <div
            className="relative p-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all duration-200"
            ref={dropdownRef}
          >
            <button
              className="relative focus:outline-none"
              onClick={() => setShowDropdown((current) => !current)}
            >
              <Bell className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors duration-200" />
              {notifications.length > 0 && (
                <span className="absolute -top-3 -right-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Notifications
                  </h3>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="text-gray-400 hover:text-gray-600 transition pb-3"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-500 text-sm">
                    No new notifications
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                    {notifications.map((note, index) => (
                      <li
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <p className="text-sm font-medium text-gray-800">
                          {note.title || "Notification"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {note.message || note.body || "No message details"}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">
                          {note.time || "Just now"}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="flex border p-2 rounded-xl shadow border-teal-100 items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{initials}</span>
            </div>
            <span className="text-gray-700 font-medium">{displayName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const UserSidebar = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Logout failed. Try again.");
      console.error(error);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-teal-100 min-h-screen shadow-sm">
      <nav className="p-4 space-y-2">
        <Link to="/dashboard">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white cursor-pointer shadow-lg transform hover:scale-105 transition-all duration-200">
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </div>
        </Link>

        <Link
          to="/books"
          className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-teal-50 rounded-lg"
        >
          <BookOpen className="w-5 h-5" />
          <span>View Books</span>
        </Link>

        <Link
          to="/searchbook"
          className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-teal-50 rounded-lg"
        >
          <Search className="w-5 h-5" />
          <span>Search Books</span>
        </Link>

        <Link
          to="/requestbook"
          className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-teal-50 rounded-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Request Book</span>
        </Link>

        <Link
          to="/returnbook"
          className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-teal-50 rounded-lg"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Return Book</span>
        </Link>

        <Link
          to="/profile"
          className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-teal-50 rounded-lg"
        >
          <User className="w-5 h-5" />
          <span>My Profile</span>
        </Link>

        <Link
          to="/finepayments"
          className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-teal-50 rounded-lg"
        >
          <Wallet className="w-5 h-5" />
          <span>Pay Fines</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg mt-8 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

const UserLayout = () => {
  return (
    <div className="min-h-screen">
      <UserHeader />
      <div className="flex font-inter bg-gray-50">
        <UserSidebar />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
