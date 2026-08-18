import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { mapActivities } from '../utils/mapactivity';
import { formatDate } from '../utils/Date';
import api from '../api/axiosInstance.js';
import AuthLoading from '../components/AuthLoading.jsx';
import {  
  Bookmark,
  BookOpen, 
  AlertTriangle,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';

const buildStats = (data) => {
  const availableBooks = data?.availableBooks ?? 0;
  const issuedBooks = data?.issuedBooks ?? 0;
  const overdueBooks = data?.overdueBooks ?? 0;
  const requestedBooks = data?.requestedBooks ?? 0;

  return [
    { id: 0, label: 'Books Available', value: availableBooks, icon: BookOpen, color: 'bg-white', bgColor: 'bg-teal-500' },
    { id: 1, label: 'Books Issued', value: issuedBooks, icon: Bookmark, color: 'bg-white', bgColor: 'bg-blue-500' },
    { id: 2, label: 'Overdue Books', value: overdueBooks, icon: AlertTriangle, color: 'bg-white', bgColor: 'bg-orange-500' },
    { id: 3, label: 'Active Requests', value: requestedBooks, icon: Clock, color: 'bg-white', bgColor: 'bg-purple-500' },
  ];
};

const getBorrowStatus = (activity) => {
  if (activity.return_date) {
    return {
      label: 'Returned',
      badgeClass: 'bg-green-100 text-green-700',
      icon: CheckCircle,
    };
  }
  if (activity.due_date && new Date(activity.due_date) < new Date()) {
    return {
      label: 'Overdue',
      badgeClass: 'bg-red-100 text-red-700',
      icon: AlertTriangle,
    };
  }
  return {
    label: 'Issued',
    badgeClass: 'bg-blue-100 text-blue-700',
    icon: Clock,
  };
};

const StatsCards = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {stats.map((stat) => (
      <div
        key={stat.id}
        className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105"
      >
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
);

const ActiveRequestsSection = ({ activeRequests }) => {
  const hasRequests = activeRequests.length > 0;

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-teal-100 shadow-xl">
      <div className="border-b border-gray-200 flex items-center justify-between mb-6 pb-2">
        <h3 className="text-xl font-poppins font-semibold text-gray-900">Active Requests</h3>
        <Link
          to="/requestbook"
          className="text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          + Request Book
        </Link>
      </div>

      {!hasRequests ? (
        <div className="text-center py-8">
          <p className="text-gray-900 font-medium">No Active Requests</p>
          <p className="text-gray-500 text-sm mt-1">
            You do not have any pending book requests.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeRequests.map((req) => {
            const itemKey = req.request_id || req.book_id || `${req.bookTitle}-${req.request_date}`;
            const bookTitle = req.bookTitle || req.title || 'Untitled Book';

            return (
              <div
                key={itemKey}
                className="flex items-center justify-between border rounded-lg p-3 px-5 border-gray-200 shadow bg-purple-50/30 gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p
                    className="text-gray-900 font-medium truncate"
                    title={bookTitle}
                  >
                    {bookTitle}
                  </p>
                  <p className="text-gray-500 text-sm mt-0.5 truncate">
                    {req.genre ? `${req.genre} • ` : ''}Requested on {formatDate(req.request_date) || 'Recent'}
                  </p>
                </div>
                <span className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                  {req.status || 'ACTIVE'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const RecentActivitySection = ({ recentActivity }) => {
  const hasActivity = recentActivity.length > 0;

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-teal-100 shadow-xl">
      <div className="border-b border-gray-200 flex items-center justify-between mb-6 pb-2">
        <h3 className="text-xl font-poppins font-semibold text-gray-900">Recent Activity</h3>
        <span className="text-xs font-medium text-gray-500">Past 7 Days</span>
      </div>

      {!hasActivity ? (
        <div className="text-center py-8">
          <p className="text-gray-900 font-medium">No Recent Activity</p>
          <p className="text-gray-500 text-sm mt-1">
            You have not borrowed or returned books in the last 7 days.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-center space-x-4 border rounded-lg p-2 px-5 border-gray-200 shadow ${activity.divColor}`}
            >
              <div
                className={`w-10 h-10 ${activity.iconColor} rounded-lg flex items-center justify-center shrink-0`}
              >
                <activity.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-gray-900 font-medium line-clamp-2 break-words"
                  title={activity.action}
                >
                  {activity.action}
                </p>
                <p className="text-gray-500 text-sm mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BorrowHistoryTable = ({ borrowHistory }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="py-3 px-4 font-semibold text-gray-700 text-sm">Book Title</th>
          <th className="py-3 px-4 font-semibold text-gray-700 text-sm">Issue Date</th>
          <th className="py-3 px-4 font-semibold text-gray-700 text-sm">Due Date</th>
          <th className="py-3 px-4 font-semibold text-gray-700 text-sm">Return Date</th>
          <th className="py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {borrowHistory.map((item) => {
          const status = getBorrowStatus(item);
          const rowKey = `${item.title}-${item.issue_date || ''}-${item.due_date || ''}-${item.return_date || ''}`;

          return (
            <tr
              key={rowKey}
              className="hover:bg-gray-50/60 transition-colors"
            >
              <td className="py-3 px-4 font-medium text-gray-900 text-sm max-w-xs md:max-w-sm">
                <div
                  className="truncate"
                  title={item.title}
                >
                  {item.title}
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                {formatDate(item.issue_date) || '—'}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                {formatDate(item.due_date) || '—'}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                {item.return_date ? (
                  formatDate(item.return_date)
                ) : (
                  <span className="text-gray-400">Not returned</span>
                )}
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status.badgeClass}`}
                >
                  {status.label}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const BorrowHistoryContent = ({ historyLoading, borrowHistory, historyPage }) => {
  if (historyLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">Loading borrow history...</p>
      </div>
    );
  }

  if (borrowHistory.length === 0) {
    const emptyMessage = historyPage > 1
      ? 'No more records found on this page.'
      : 'Books you borrow from the library will appear here.';

    return (
      <div className="text-center py-8">
        <p className="text-gray-900 font-medium">No Borrow History Found</p>
        <p className="text-gray-500 text-sm mt-1">{emptyMessage}</p>
      </div>
    );
  }

  return <BorrowHistoryTable borrowHistory={borrowHistory} />;
};

const BorrowHistorySection = ({
  borrowHistory,
  historyLoading,
  historyPage,
  historyLimit,
  onPrevPage,
  onNextPage,
}) => {
  const isPrevDisabled = historyPage <= 1 || historyLoading;
  const isNextDisabled = borrowHistory.length < historyLimit || historyLoading;

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-teal-100 shadow-xl mb-8">
      <div className="border-b border-gray-200 flex items-center justify-between mb-6 pb-2">
        <h3 className="text-xl font-poppins font-semibold text-gray-900">Borrow History</h3>
        <span className="text-sm font-medium text-gray-600">Page {historyPage}</span>
      </div>

      <BorrowHistoryContent
        historyLoading={historyLoading}
        borrowHistory={borrowHistory}
        historyPage={historyPage}
      />

      {!historyLoading && borrowHistory.length > 0 && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
          <p className="text-sm text-gray-600">
            Showing page <span className="font-medium text-gray-900">{historyPage}</span> ({borrowHistory.length} records)
          </p>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onPrevPage}
              disabled={isPrevDisabled}
              className={`inline-flex items-center space-x-1 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                isPrevDisabled
                  ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <button
              type="button"
              onClick={onNextPage}
              disabled={isNextDisabled}
              className={`inline-flex items-center space-x-1 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                isNextDisabled
                  ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [activeRequests, setActiveRequests] = useState([]);
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const historyLimit = 5;

  const fetchBorrowHistory = useCallback(async (pageToFetch) => {
    try {
      setHistoryLoading(true);
      const res = await api.get('/users/me/activities', {
        params: { page: pageToFetch, limit: historyLimit },
        withCredentials: true,
      });

      const returnedActivities = res.status === 200 && res.data?.activities ? res.data.activities : [];
      setBorrowHistory(returnedActivities);
    } catch (error) {
      console.error('Error fetching borrow history:', error);
      setBorrowHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [historyLimit]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const results = await Promise.allSettled([
          api.get('/users/me/stats', { withCredentials: true }),
          api.get('/users/me/activities', { params: { filter: 'recent' }, withCredentials: true }),
          api.get('/users/me/requests', { params: { mode: 'active', page: 1, limit: 6 }, withCredentials: true }),
          api.get('/users/me/activities', { params: { page: 1, limit: historyLimit }, withCredentials: true }),
        ]);

        const [statsResult, recentResult, requestsResult, historyResult] = results;
        const statsRes = statsResult.status === 'fulfilled' ? statsResult.value : null;
        const recentRes = recentResult.status === 'fulfilled' ? recentResult.value : null;
        const requestsRes = requestsResult.status === 'fulfilled' ? requestsResult.value : null;
        const historyRes = historyResult.status === 'fulfilled' ? historyResult.value : null;

        const statsData = statsRes?.status === 200 ? statsRes.data : null;
        setStats(buildStats(statsData));

        const recentRaw = recentRes?.status === 200 && recentRes.data?.activities ? recentRes.data.activities : [];
        setRecentActivity(mapActivities(recentRaw));

        const reqList = requestsRes?.status === 200
          ? (Array.isArray(requestsRes.data) ? requestsRes.data : (requestsRes.data?.data || []))
          : [];
        setActiveRequests(reqList);

        const historyRaw = historyRes?.status === 200 && historyRes.data?.activities ? historyRes.data.activities : [];
        setBorrowHistory(historyRaw);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(buildStats(null));
        setRecentActivity([]);
        setActiveRequests([]);
        setBorrowHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [historyLimit]);

  const handlePrevPage = () => {
    if (historyPage > 1 && !historyLoading) {
      const prevPage = historyPage - 1;
      setHistoryPage(prevPage);
      fetchBorrowHistory(prevPage);
    }
  };

  const handleNextPage = () => {
    if (borrowHistory.length === historyLimit && !historyLoading) {
      const nextPage = historyPage + 1;
      setHistoryPage(nextPage);
      fetchBorrowHistory(nextPage);
    }
  };

  if (loading) {
    return <AuthLoading />;
  }

  return (
    <main className="flex-1 p-6 bg-teal-50">
      <div className="mb-8">
        <h2 className="text-3xl font-poppins font-bold bg-gradient-to-r from-teal-700 to-blue-700 bg-clip-text text-transparent">
          Dashboard Overview
        </h2>
        <p className="text-gray-600">Welcome back! Here's your library activity summary.</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ActiveRequestsSection activeRequests={activeRequests} />
        <RecentActivitySection recentActivity={recentActivity} />
      </div>

      <BorrowHistorySection
        borrowHistory={borrowHistory}
        historyLoading={historyLoading}
        historyPage={historyPage}
        historyLimit={historyLimit}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
    </main>
  );
};

export default Dashboard;
