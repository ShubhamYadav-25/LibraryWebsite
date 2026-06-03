import { useEffect, useRef, useState } from "react";
import Footer from "./Footer.jsx";
import { 
  BookOpen, 
  Search,
  Bell, 
  Users,
  BarChart3,
  Settings,
  FileText,
  ArrowLeftRight,
  LogOut,
  XCircle,
} from 'lucide-react';
import { useAuth } from "../context/AuthProvider";
import useLogout from "../hooks/Logout";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

const AdminHeader = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useAuth();

  const displayName = user?.name || "Admin";
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

  return(
  <header className="bg-white border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-poppins font-bold bg-gradient-to-r from-teal-700 to-blue-700 bg-clip-text text-transparent">LibraryMS</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        
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
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden"> 
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {initials}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-600">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  </header>
);
};


const AdminSidebar = ({ activeItem, setActiveItem }) => {
  const logout = useLogout();
  const navigate = useNavigate();

  const menuItems = [
    { id: "admindashboard", path: "/admindashboard", icon: BarChart3, label: "Dashboard" },
    { id: "catalog", path: "/catalog", icon: BookOpen, label: "Book Catalog" },
    { id: "requests", path: "/requests", icon: ArrowLeftRight, label: "Issue & Return" },
    { id: "users", path: "/users", icon: Users, label: "Users" },
    { id: "reports", path: "/reports", icon: FileText, label: "Reports" },
    { id: "settings", path: "/settings", icon: Settings, label: "Settings" },
  ];

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
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setActiveItem?.(item.id)}
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}

        <button
          type="button"
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

const AdminLayout = () => {
  return (
    <div className="min-h-screen">
      <AdminHeader />
      <div className="flex font-inter bg-gray-50">
        <AdminSidebar />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;