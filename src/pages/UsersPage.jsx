import { useState, useEffect } from 'react';
import api from '../api/axiosInstance.js';

import {  
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  X,
  Save,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Download,
  Upload,
  UserCheck,
} from 'lucide-react';

// Add/Edit User Modal Component
export const UserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState(user || {
    fullName: '',
    email: '',
    phone: '',
    department: '',
    batch: '',
    address: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        department: '',
        batch: '',
        address: '',
        joinDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {user ? 'Edit User' : 'Add New User'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="john.doe@university.edu"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select department</option>
                <option value={"COMPUTER SCIENCE"}>Computer Science</option>
                <option value={"ELECTRICAL"}>Electrical</option>
                <option value={"MECHANICAL"}>Mechanical</option>
                <option value={"CIVIL"}>Civil</option>
                <option value={"CHEMICAL"}>Chemical</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year
              </label>
              <select
                value={new Date().getFullYear() - Number(formData.batch.slice(0, 4))}
                onChange={(e) => setFormData({...formData, batch: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select year</option>
                <option value={0}>1st Year</option>
                <option value={1}>2nd Year</option>
                <option value={2}>3rd Year</option>
                <option value={3}>4th Year</option>
                <option value={4}>Graduate</option>
              </select>
            </div>

            {/* Registration Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Date
              </label>
              <input
                type="date"
                value={new Date(formData.joinDate).toISOString().split('T')[0]}
                onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter complete address"
              />
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{user ? 'Update User' : 'Add User'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 hover:bg-gray-50 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// User Details Modal Component
const UserDetailsModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;
  const initials =
    user.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "?";
  
    let  count_overdue = user.books ? user.books.filter(book => new Date(book.dueDate) < new Date()).length : 0;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* User Profile Section */}
          <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {initials}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
              <p className="text-gray-600">{user.studentId}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                user.fine == 0.00 ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700' 
                }`}>
                Fine: {user.totalFine || 0.00}
              </span>
            </div>
          </div>

          {/* User Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <UserCheck className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium text-gray-900">{user.department}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Registration Date</p>
                  <p className="font-medium text-gray-900">{new Date(user.joinDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Books Issued</p>
                  <p className="font-medium text-gray-900">{user.issuedBooks} books</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Overdue Books</p>
                  <p className="font-medium text-gray-900">{count_overdue} books</p>
                </div>
              </div>
            </div>
          </div>

          {/* Borrowing History */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Borrowing History</h4>
            <div className="space-y-3">
              {user.books && user.books.map((book) => (
                <div key={book.id || book.title} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{book.title}</p>
                    <p className="text-sm text-gray-600">issued on {new Date(book.issueDate).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    book.dueDate < new Date() ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {book.dueDate < new Date() ? 'Overdue' : 'On Time'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 px-6 py-3 border border-gray-300 hover:bg-gray-50 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// User Table Row Component
const UserTableRow = ({ user, onEdit, onDelete, onView }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-600">{user.studentId}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-gray-900">{user.email}</p>
        <p className="text-sm text-gray-600">+91-{user.phone}</p>
      </td>
      <td className="px-6 py-4 text-gray-700">{user.department}</td>
      <td className="px-6 py-4 text-gray-700">{user.batch}</td>
      <td className="px-6 py-4">
        <div className="text-center">
          <p className="font-semibold text-gray-900">{user.issuedBooks}</p>
          {/* {user.overdueBooks > 0 && (
            <p className="text-xs text-red-600">{user.overdueBooks} overdue</p>
          )} */}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          user.fine == 0.00 ? 'bg-green-100 text-green-700' :
          'bg-red-100 text-red-700' 
        }`}>
          {user.totalFine || 0.00}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button
                onClick={() => { onView(user); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
              <button
                onClick={() => { onEdit(user); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => { onDelete(user); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// Main Users Page Component
const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All Departments');
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const itemsPerPage = 7;


  useEffect(() => {
    const delay = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1);
    }, 1000);
  
    return () => clearTimeout(delay);
  }, [searchInput]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users...");
        const params = {
          page,
          limit: itemsPerPage,
        };
  
        if (searchQuery) params.search = searchQuery;
        if (filterDepartment !== 'All Departments') params.department = filterDepartment;
  
        const res = await api.get('/admin/users', {
          params,
          withCredentials: true,
        });
  
        setUsers(res.data.data || []);
        setTotal(res.data.total || 0);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchUsers();
  }, [page, searchQuery, filterDepartment]);


  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };


  const handleViewUser = async (user) => {
    try {
      setSelectedUser(null); // Reset before fetching new data
      const [userRes, booksRes] = await Promise.all([
        api.get(`/users/${user.studentId}`, {
          withCredentials: true,
        }),
        api.get(`/users/${user.studentId}/books`, {
          withCredentials: true,
        }),
      ]);

      let userData = userRes.data;
      userData.books = booksRes.data || [];
      console.log('Fetched user:', userData);
      setSelectedUser(userData);
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Failed to fetch user details', err);
    }
  };


  const handleUpdateUser = async (userData) => {
    try {
      await api.put(
        `/user/${userData.studentId}`,
        userData,
        { withCredentials: true }
      );
      setShowModal(false);
      setEditingUser(null);
      setPage(1);
    } catch (err) {
      console.error('Failed to update user', err);
    }
  };

  const handleAddNewUser = async (userData) => {
    try {
      await api.post(
        '/user',
        userData,
        { withCredentials: true }
      );
      setShowModal(false);
      setEditingUser(null);
      setPage(1);
    } catch (err) {
      console.error('Failed to add user', err);
    }
  };

  const handleSaveUser = async (userData) => {
    if (editingUser) {
      await handleUpdateUser(userData);
    } else {
      await handleAddNewUser(userData);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Users Management</h1>
          <p className="text-gray-600">Manage student accounts and track their activity</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:gap-6">
            <div className="flex-1 flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or email..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSearchQuery(searchInput);
                      setPage(1);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterDepartment}
                onChange={(e) => {
                  setFilterDepartment(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option>All Departments</option>
                <option>Computer Science</option>
                <option>Electrical</option>
                <option>Mechanical</option>
                <option>Civil</option>
                <option>Chemical</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
              <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Import</span>
              </button>
              <button
                onClick={handleAddUser}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">User</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Contact</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Department</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Year</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Books</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Fine</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <UserTableRow
                    key={user.studentId}
                    user={user}
                    onEdit={handleEditUser}
                    onDelete={(user) => console.log('Delete:', user)}
                    onView={handleViewUser}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {Math.min((page - 1) * itemsPerPage + 1, total)} to {Math.min(page * itemsPerPage, total)} of {total} users
            </p>
            <div className="flex space-x-2">
              <button 
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.ceil(total / itemsPerPage) }, (_, i) => i + 1).slice(0, 5).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    page === pageNum
                      ? 'bg-purple-500 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              
              <button 
                onClick={() => setPage(prev => prev + 1)}
                disabled={page >= Math.ceil(total / itemsPerPage)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <UserModal isOpen={showModal} onClose={() => setShowModal(false)} user={editingUser} onSave={handleSaveUser} />
      <UserDetailsModal isOpen={showDetailsModal} onClose={() => { setShowDetailsModal(false); setSelectedUser(null); }} user={selectedUser} />
    </div>
  );
};

export default UsersPage;