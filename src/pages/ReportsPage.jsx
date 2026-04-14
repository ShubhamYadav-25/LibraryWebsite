import { useState } from 'react';
import { 
  FileText, 
  Download,
  Calendar,
  TrendingUp,
  BookOpen,
  Users,
  Clock,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  Filter,
  Eye
} from 'lucide-react';

// Report Card Component
const ReportCard = ({ title, description, icon: Icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <Download className="w-5 h-5 text-gray-600" />
      </button>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 mb-4">{description}</p>
    <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center space-x-1">
      <span>Generate Report</span>
      <Eye className="w-4 h-4" />
    </button>
  </div>
);

// Statistics Card Component
const StatCard = ({ title, value, change, icon: Icon, bgColor }) => (
  <div className={`${bgColor} rounded-xl p-6`}>
    <div className="flex items-center justify-between mb-2">
      <Icon className="w-8 h-8 text-white opacity-80" />
      <span className="text-white text-sm font-medium">{change}</span>
    </div>
    <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
    <p className="text-white opacity-90 text-sm">{title}</p>
  </div>
);

// Report Preview Modal
const ReportPreviewModal = ({ isOpen, onClose, reportType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{reportType}</h2>
            <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              Close
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Preview</h3>
            <p className="text-gray-600">Report data and visualizations will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Reports Page Component
const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('thisMonth');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  const reports = [
    {
      id: 1,
      title: 'Circulation Report',
      description: 'Track book issues, returns, and circulation trends over time',
      icon: TrendingUp,
      color: 'bg-blue-500',
      category: 'circulation'
    },
    {
      id: 2,
      title: 'Overdue Books Report',
      description: 'List of all overdue books with student details and fine amounts',
      icon: AlertTriangle,
      color: 'bg-red-500',
      category: 'circulation'
    },
    {
      id: 3,
      title: 'Popular Books Report',
      description: 'Most borrowed books and trending titles in your library',
      icon: BookOpen,
      color: 'bg-green-500',
      category: 'collection'
    },
    {
      id: 4,
      title: 'User Activity Report',
      description: 'Student borrowing patterns and library usage statistics',
      icon: Users,
      color: 'bg-purple-500',
      category: 'users'
    },
    {
      id: 5,
      title: 'Collection Analysis',
      description: 'Detailed analysis of library collection by genre, author, and year',
      icon: BarChart3,
      color: 'bg-orange-500',
      category: 'collection'
    },
    {
      id: 6,
      title: 'Daily Activity Log',
      description: 'Day-to-day operations including issues, returns, and new registrations',
      icon: Activity,
      color: 'bg-teal-500',
      category: 'operations'
    },
    {
      id: 7,
      title: 'Fine Collection Report',
      description: 'Summary of fines collected, pending payments, and revenue analysis',
      icon: FileText,
      color: 'bg-yellow-600',
      category: 'financial'
    },
    {
      id: 8,
      title: 'Inventory Report',
      description: 'Current stock levels, missing books, and inventory status',
      icon: PieChart,
      color: 'bg-indigo-500',
      category: 'collection'
    }
  ];

  const stats = [
    { title: 'Total Reports Generated', value: '127', change: '+12 this month', icon: FileText, bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { title: 'Books in Circulation', value: '342', change: '+8% from last month', icon: TrendingUp, bgColor: 'bg-gradient-to-br from-green-500 to-green-600' },
    { title: 'Overdue Items', value: '12', change: '-5 from last week', icon: AlertTriangle, bgColor: 'bg-gradient-to-br from-red-500 to-red-600' },
    { title: 'Active Users', value: '1,234', change: '+45 new this month', icon: Users, bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Generate detailed reports and analyze library performance</p>
        </div>

        {/* Date Range Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-900">Date Range:</span>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="thisYear">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {dateRange === 'custom' && (
              <div className="flex items-center space-x-4">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-gray-600">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}

            <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Apply Filter</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 text-left">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Export All Data</h3>
            <p className="text-sm text-gray-600">Download complete library data in CSV or Excel format</p>
          </button>

          <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 text-left">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Reports</h3>
            <p className="text-sm text-gray-600">Set up automatic report generation and email delivery</p>
          </button>

          <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 text-left">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Reports</h3>
            <p className="text-sm text-gray-600">Create custom reports with specific parameters</p>
          </button>
        </div>

        {/* Report Categories */}
        <div className="space-y-8">
          {/* Circulation Reports */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Circulation Reports</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.filter(r => r.category === 'circulation').map((report) => (
                <ReportCard
                  key={report.id}
                  {...report}
                  onClick={() => setSelectedReport(report.title)}
                />
              ))}
            </div>
          </div>

          {/* Collection Reports */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Collection Reports</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.filter(r => r.category === 'collection').map((report) => (
                <ReportCard
                  key={report.id}
                  {...report}
                  onClick={() => setSelectedReport(report.title)}
                />
              ))}
            </div>
          </div>

          {/* User Reports */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Reports</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.filter(r => r.category === 'users').map((report) => (
                <ReportCard
                  key={report.id}
                  {...report}
                  onClick={() => setSelectedReport(report.title)}
                />
              ))}
            </div>
          </div>

          {/* Financial Reports */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Reports</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.filter(r => r.category === 'financial').map((report) => (
                <ReportCard
                  key={report.id}
                  {...report}
                  onClick={() => setSelectedReport(report.title)}
                />
              ))}
            </div>
          </div>

          {/* Operations Reports */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Operations Reports</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.filter(r => r.category === 'operations').map((report) => (
                <ReportCard
                  key={report.id}
                  {...report}
                  onClick={() => setSelectedReport(report.title)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ReportPreviewModal
        isOpen={selectedReport !== null}
        onClose={() => setSelectedReport(null)}
        reportType={selectedReport}
      />
    </div>
  );
};

export default ReportsPage;