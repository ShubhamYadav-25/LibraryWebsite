import { useState,useEffect } from "react";
import {
  BookOpen,
  TrendingUp,
  Clock,
  Users,
 
} from 'lucide-react';
import api from '../api/axiosInstance.js';

import {StatCard } from "../components/UIcomponent2"
import { ActivityItem , PopularBookItem, OverdueBookItem, LibraryStats, QuickActions} from "../components/UIcomponent2";

// Main Dashboard Component
const AdminDashboard = () => {
  // const [activeItem, setActiveItem] = useState('dashboard');
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Stats, setStats] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [issuedBooks, setIssuedBooks] = useState(0);
  const [overdueBooks, setoverdueBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const apiCalls = await Promise.all([
          api.get('/admin/stats', { withCredentials: true }),
          api.get('/admin/activities', { withCredentials: true }),
          api.get('/books/overdue', { withCredentials: true }),
          api.get('/books/popular', { withCredentials: true }),
        ]);

        const [statsRes, activities, duebooks, booksRes] = apiCalls;

        if (statsRes.status === 200) {
          const data = statsRes.data;
          setTotalBooks(data.totalBooks);
          setIssuedBooks(data.issuedBooks);
          const increment = (data.thisMonth - data.previousMonth) / (data.previousMonth || 1) * 100; 
          setStats([
          {
            title: 'Total Books',
            value: data.totalBooks,
            change: `+${data.addedThisWeek} this week`,
            icon: BookOpen,
            bgColor: 'bg-blue-50',
            iconBgColor: 'bg-blue-500'
          },
          {
            title: 'Books Issued',
            value: data.issuedBooks,
            change: `+${increment.toFixed(1)}% from last month`,
            icon: TrendingUp,
            bgColor: 'bg-green-50',
            iconBgColor: 'bg-green-500'
          },
          {
            title: 'Overdue books',
            value: data.overdueBooks,
            change: ` ${data.dueToday} due today`,
            icon: Clock,
            bgColor: 'bg-purple-50',
            iconBgColor: 'bg-orange-500'
          },
          {
            title: 'Active Request',
            value: data.activeRequest,
            change: `+${data.newToday} new today`,
            icon: Users,
            bgColor: 'bg-teal-50',
            iconBgColor: 'bg-teal-500'
          }])
        }

        if (activities.status === 200 && activities.data?.activities) {
          setRecentActivity(activities.data.activities); 
        }

        if(duebooks.status === 200 ){
          setoverdueBooks(duebooks.data);
        }

        if(booksRes.status === 200){
          setPopularBooks(booksRes.data);
        }
      }
      catch (error) {
        console.error('Error fetching dashboard data:', error);
      } 
    };

    fetchDashboardData();
  }, []);


  return (
    <> 
    <main className="flex-1 p-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Welcome back, Admin. Here's what's happening in your library today.</p>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All
              </button>
            </div>
            <div className="space-y-2">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-gray-400 text-center">
                  No recent activities today
                </p>
              ) : (
                recentActivity.map((activity, index) => (
                  <ActivityItem key={index} {...activity} />
                ))
              )}
            </div>
          </div>
          {/* Popular Books */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Books This Month</h3>
            <div className="space-y-2">
              {popularBooks.map((book, index) => (
                <PopularBookItem key={index} {...book} />
              ))}
            </div>
          </div>
        </div>
        {/* Sidebar Widgets */}
        <div className="md:col-span-1">
          <QuickActions />
          
          {/* Overdue Books */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Overdue Books</h3>
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                {overdueBooks.length} items
              </span>
            </div>
            <div className="space-y-2">
              {overdueBooks.length === 0 ? (
                <p className="text-sm text-gray-400 text-center">
                  No overdue books
                </p>
              ) : (
                overdueBooks.map((book, index) => (
                  <OverdueBookItem key={index} {...book} />
                ))
              )}
            </div>
          </div>

          <LibraryStats 
            totalBooks={totalBooks}
            issuedBooks={issuedBooks} />
        </div>
      </div>
    </main>
    </>
  );
};

export default AdminDashboard;