import { useState, useEffect, useMemo } from 'react';
import { BookCard} from '../components/UIcomponents';
import { mapActivities } from '../utils/mapactivity';
import api from '../api/axiosInstance.js';
import AuthLoading from '../components/AuthLoading.jsx';
import {  
  Bookmark,
  BookOpen, 
  Search, 
  AlertTriangle,
  Clock,
} from 'lucide-react';


const Dashboard = () => {
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [sortBy, setSortBy] = useState('Sort by Title');
  const [searchQuery, setSearchQuery] = useState('');
  // searchTermSubmitted is only updated when user presses Enter — used to trigger API search
  const [searchTermSubmitted, setSearchTermSubmitted] = useState('');
  const [stats, setStats] = useState([]);
  const [books, setBooks] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Build query params; include bookName and genre ONLY when a search has been submitted
        const params = { page: 1, limit: 4 };
        const trimmedSubmitted = (searchTermSubmitted || '').trim();
        if (trimmedSubmitted.length > 0) {
          params.bookName = trimmedSubmitted; // only include when search submitted
          if (selectedGenre && selectedGenre !== 'All Genres') params.genre = selectedGenre;
        }

        const results = await Promise.allSettled([
          api.get('/books', { params, withCredentials: true }),
          api.get('/users/me/stats', { withCredentials: true }),
          api.get('/users/me/activities', { withCredentials: true }),
        ]);

        const [booksResult, statsResult, activityResult] = results;
        const booksRes = booksResult.status === 'fulfilled' ? booksResult.value : null;
        const statsRes = statsResult.status === 'fulfilled' ? statsResult.value : null;
        const activityRes = activityResult.status === 'fulfilled' ? activityResult.value : null;


        if (booksRes?.status === 200) {
          const returned = booksRes.data.books || [];
          setBooks(returned);
        } else {
          setBooks([]);
        }

        if (statsRes?.status === 200) {
          const data = statsRes.data;
          setStats([
            { id: 0, label: 'Books Available', value: data.availableBooks, icon: BookOpen, color: 'bg-white', bgColor: 'bg-teal-500' },
            { id: 1, label: 'Books Issued', value: data.issuedBooks, icon: Bookmark, color: 'bg-white', bgColor: 'bg-blue-500' },
            { id: 2, label: 'Overdue Books', value: data.overdueBooks, icon: AlertTriangle, color: 'bg-white', bgColor: 'bg-orange-500' },
            { id: 3, label: 'Active Requests', value: data.requestedBooks, icon: Clock, color: 'bg-white', bgColor: 'bg-purple-500' },
          ]);
        } else {
          setStats([
            { id: 0, label: 'Books Available', value: 0, icon: BookOpen, color: 'bg-white', bgColor: 'bg-teal-500' },
            { id: 1, label: 'Books Issued', value: 0, icon: Bookmark, color: 'bg-white', bgColor: 'bg-blue-500' },
            { id: 2, label: 'Overdue Books', value: 0, icon: AlertTriangle, color: 'bg-white', bgColor: 'bg-orange-500' },
            { id: 3, label: 'Active Requests', value: 0, icon: Clock, color: 'bg-white', bgColor: 'bg-purple-500' },
          ]);
        }

        if (activityRes?.status === 200 && activityRes.data?.activities) {
          const mapped = mapActivities(activityRes.data.activities || []);
          setRecentActivity(mapped);
        } else {
          setRecentActivity([]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set some default data to prevent infinite loading
        setBooks([]);
        setStats([
          { id: 0, label: 'Books Available', value: 0, icon: BookOpen, color: 'bg-white', bgColor: 'bg-teal-500' },
          { id: 1, label: 'Books Issued', value: 0, icon: Bookmark, color: 'bg-white', bgColor: 'bg-blue-500' },
          { id: 2, label: 'Overdue Books', value: 0, icon: AlertTriangle, color: 'bg-white', bgColor: 'bg-orange-500' },
          { id: 3, label: 'Active Requests', value: 0, icon: Clock, color: 'bg-white', bgColor: 'bg-purple-500' },
        ]);
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [searchTermSubmitted, selectedGenre]);

  // Derive displayedBooks sorted client-side by the selected sort option.
  const displayedBooks = useMemo(() => {
    const arr = [...books];
    const key = (sortBy || '').toLowerCase();
    if (key.includes('author')) {
      arr.sort((a, b) => (a.author || '').localeCompare(b.author || ''));
    } else if (key.includes('title')) {
      arr.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }
    return arr;
  }, [books, sortBy]);



  return (
    <>
    {/* Main Content */}
    <main className="flex-1 p-6 bg-teal-50">
      {/* Dashboard Overview */}
      {loading ? (
      <AuthLoading />
    ) : (
      <>
      <div className="mb-8">
        <h2 className="text-3xl font-poppins font-bold bg-gradient-to-r from-teal-700
         to-blue-700 bg-clip-text text-transparent">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome back! Here's your library activity summary.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-teal-100 
          shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Browse Books */}
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-teal-100 shadow-xl mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-poppins font-semibold text-gray-900">Search & Browse Books</h3>
            <div className="flex items-center space-x-4">
              <select 
                name='genre'
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-4 py-3 border border-teal-200 rounded-xl text-sm font-medium bg-white/80 focus:ring-2 
                focus:ring-teal-500 focus:border-transparent transition-all"
              >
                <option>All Genres</option>
                <option>Programming</option>
                <option>Fiction</option>
                <option>Non-Fiction</option>
                <option>Poetry</option>
              </select>
              <select 
                name='sortby'
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-teal-200 rounded-xl text-sm font-medium bg-white/80 focus:ring-2 
                focus:ring-teal-500 focus:border-transparent transition-all"
              >
                <option>Sort by Title</option>
                <option>Sort by Author</option>
              </select>
            </div>
          </div>
          
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              name='searchbar'
              type="text"
              placeholder="Search by title, author, or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // submit the current typed query
                  setSearchTermSubmitted(searchQuery);
                }
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Books Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedBooks.map((book, index) => (
              <BookCard key={index} book={book} showActions={false} />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-teal-100 shadow-xl">
        <div className="border-b border-gray-200">
          <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-6">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className={`flex items-center space-x-4 border rounded-lg p-2 px-5 border-gray-200 shadow ${activity.divColor}`}>
                <div className={`w-10 h-10 ${activity.iconColor} rounded-lg flex items-center justify-center`}>
                  <activity.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.action}</p>
                  <p className="text-gray-500 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </>
    )}
    </main>
    </>
  );
};

export default Dashboard;
