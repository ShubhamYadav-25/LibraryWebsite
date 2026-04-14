
import { Outlet } from "react-router-dom";
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
} from 'lucide-react';


const AdminHeader = () => (
  <header className="bg-white border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-blue-600">LibraryMS</h1>
          <p className="text-xs text-gray-600">Management System</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search books, authors, ISBN..."
            className="pl-10 pr-4 py-2 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
          />
        </div>
        
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </div>
        
        <div className="flex items-center space-x-3">
          <img 
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
            alt="Admin"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">Sarah Admin</p>
            <p className="text-xs text-gray-600">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  </header>
);


const AdminSidebar = ({ activeItem, setActiveItem }) => {
  const menuItems = [
    { id: 'admindashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'catalog', icon: BookOpen, label: 'Book Catalog' },
    { id: 'requests', icon: ArrowLeftRight, label: 'Issue & Return' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <div className="mb-6">
        <img 
          src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=300&q=80"
          alt="Library"
          className="w-full h-32 object-cover rounded-xl"
        />
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <a 
            key={item.id}
            href={`/${item.id}`}
            onClick={() => setActiveItem(item.id)}
          >
            <div
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                activeItem === item.id
                  ? item.gradient
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </div>
          </a>
        ))}
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
        <Outlet /> {/* This is where the child route component will render */}
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;