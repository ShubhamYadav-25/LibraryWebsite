import { useEffect, useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  BookOpen,
  Users,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  Filter,
  Eye,
} from 'lucide-react';
import api from '../api/axiosInstance.js';

const formatDateInputValue = (value) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getRangeParams = (dateRange, startDate, endDate) => {
  if (dateRange === 'custom') {
    if (!startDate || !endDate) {
      return null;
    }

    return {
      from: startDate,
      to: endDate,
      range: 'custom',
    };
  }

  if (dateRange === 'yesterday') {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return {
      from: formatDateInputValue(yesterday),
      to: formatDateInputValue(yesterday),
      range: 'custom',
    };
  }

  const rangeMap = {
    today: 'today',
    thisWeek: 'this_week',
    thisMonth: 'this_month',
    lastMonth: 'last_month',
    thisYear: 'this_year',
  };

  return {
    range: rangeMap[dateRange] || 'this_month',
  };
};

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

const normalizeRows = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.rows)) return payload.rows;
  }
  return [];
};

const formatCellValue = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'number') return value.toLocaleString();
  return String(value);
};

const getTableColumns = (reportType) => {
  switch (reportType) {
    case 'circulation':
      return [
        { key: 'student_name', label: 'Student' },
        { key: 'book_title', label: 'Book' },
        { key: 'status', label: 'Status' },
        { key: 'issue_date', label: 'Issued' },
        { key: 'due_date', label: 'Due' },
      ];
    case 'overdue':
      return [
        { key: 'student_name', label: 'Student' },
        { key: 'book_title', label: 'Book' },
        { key: 'overdue_days', label: 'Overdue Days' },
        { key: 'fine_amount', label: 'Fine' },
      ];
    case 'popular-books':
      return [
        { key: 'title', label: 'Title' },
        { key: 'author', label: 'Author' },
        { key: 'borrow_count', label: 'Borrows' },
      ];
    case 'collection':
      return [
        { key: 'genre', label: 'Genre' },
        { key: 'total_titles', label: 'Titles' },
        { key: 'total_copies', label: 'Copies' },
        { key: 'issued_copies', label: 'Issued' },
      ];
    case 'inventory':
      return [
        { key: 'title', label: 'Title' },
        { key: 'author', label: 'Author' },
        { key: 'available_copies', label: 'Available' },
        { key: 'missing_copies', label: 'Missing' },
      ];
    case 'user-activity':
      return [
        { key: 'name', label: 'Student' },
        { key: 'department', label: 'Department' },
        { key: 'total_books_issued', label: 'Issued' },
        { key: 'overdue_books', label: 'Overdue' },
      ];
    case 'fine-collection':
      return [
        { key: 'student_name', label: 'Student' },
        { key: 'fine_count', label: 'Fine Count' },
        { key: 'total_fine', label: 'Total Fine' },
      ];
    case 'daily-activity':
      return [
        { key: 'activity_date', label: 'Date' },
        { key: 'issues', label: 'Issues' },
        { key: 'returns', label: 'Returns' },
        { key: 'new_registrations', label: 'New Users' },
      ];
    default:
      return [];
  }
};

const getChartSummaryItems = (reportType, rows) => {
  const safeRows = rows.slice(0, 6);

  switch (reportType) {
    case 'collection':
      return safeRows.map((item) => ({
        title: item.genre || 'Unknown genre',
        items: [
          { label: 'Titles', value: item.total_titles },
          { label: 'Copies', value: item.total_copies },
          { label: 'Issued', value: item.issued_copies },
        ],
      }));
    case 'user-activity':
      return safeRows.map((item) => ({
        title: item.period || item.name || 'Activity',
        items: [
          { label: 'Active Users', value: item.active_users },
          { label: 'Total Issues', value: item.total_issues },
        ],
      }));
    case 'fine-collection':
      return safeRows.map((item) => ({
        title: item.period || 'Period',
        items: [
          { label: 'Fine Collected', value: item.total_fine_collected },
          { label: 'Transactions', value: item.fine_transactions },
        ],
      }));
    default:
      return safeRows.map((item) => {
        const columns = getTableColumns(reportType).slice(0, 3);
        return {
          title: columns[0] ? formatCellValue(item[columns[0].key]) : 'Record',
          items: columns.slice(1).map((column) => ({
            label: column.label,
            value: item[column.key],
          })),
        };
      });
  }
};

// Report Preview Modal
const ReportPreviewModal = ({ isOpen, onClose, report, filters }) => {
  const [activeView, setActiveView] = useState('chart');

  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{report.title}</h2>
            <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-full bg-gray-100 p-1">
              <button
                onClick={() => setActiveView('chart')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeView === 'chart' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-white'}`}
              >
                Chart
              </button>
              <button
                onClick={() => setActiveView('table')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeView === 'table' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-white'}`}
              >
                Table
              </button>
            </div>
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
          <div className="mb-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 text-center">
            <BarChart3 className="w-14 h-14 mx-auto text-purple-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Live Report Preview</h3>
            <p className="mt-1 text-sm text-gray-600">The preview is powered by the admin API and highlights the most useful fields from each report.</p>
          </div>
          <ReportPreviewContent report={report} filters={filters} activeView={activeView} />
        </div>
      </div>
    </div>
  );
};

const ReportPreviewContent = ({ report, filters, activeView }) => {
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { dateRange, startDate, endDate, refreshKey } = filters || {};

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadReportData = async () => {
      const params = getRangeParams(dateRange, startDate, endDate);
      if (!params) {
        if (isMounted) {
          setError('Please select a valid date range to load report data.');
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError('');

        const [chartResponse, tableResponse] = await Promise.all([
          api.get(`/admin/reports/${report.reportType}/chart`, {
            params,
            signal: controller.signal,
          }),
          api.get(`/admin/reports/${report.reportType}/table`, {
            params: { ...params, page, limit: 8 },
            signal: controller.signal,
          }),
        ]);

        if (!isMounted) return;

        const chartItems = normalizeRows(chartResponse.data);
        const tableItems = normalizeRows(tableResponse.data);

        setChartData(chartItems);
        setTableData(tableItems);
        setHasMore(tableItems.length === 8);
      } catch (err) {
        if (err.name === 'CanceledError') return;
        if (isMounted) {
          setError('Unable to load report data from the server right now.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadReportData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [dateRange, endDate, page, refreshKey, report.reportType, startDate]);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-600">
        Loading report data from the admin API...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error}
      </div>
    );
  }

  const columns = getTableColumns(report.reportType);
  const chartSummaryItems = getChartSummaryItems(report.reportType, chartData);

  const handlePrevPage = () => setPage((value) => Math.max(1, value - 1));
  const handleNextPage = () => setPage((value) => value + 1);

  if (activeView === 'table') {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">Report Table</h4>
            <p className="text-sm text-gray-600">Showing the key columns returned by the report query.</p>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">{tableData.length} rows</span>
        </div>

        {tableData.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key} className="px-3 py-3 text-left font-semibold text-gray-700">{column.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {tableData.map((row, index) => (
                    <tr key={`${row.transaction_id || row.studentId || row.book_id || index}`} className="hover:bg-gray-50">
                      {columns.map((column) => (
                        <td key={column.key} className="whitespace-nowrap px-3 py-3 text-gray-700">
                          {formatCellValue(row[column.key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500">Page {page}</p>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={!hasMore}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
            No table rows were returned for this range.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Chart Summary</h4>
          <p className="text-sm text-gray-600">The most important values returned by the chart API are shown here.</p>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">{chartData.length} points</span>
      </div>

      {chartSummaryItems.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {chartSummaryItems.map((item, index) => (
            <div key={`${item.title}-${index}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="font-semibold text-gray-900">{item.title}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {item.items.map((metric) => (
                  <div key={`${item.title}-${metric.label}`} className="rounded-lg bg-white p-3 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-gray-500">{metric.label}</p>
                    <p className="mt-1 text-base font-semibold text-gray-900">{formatCellValue(metric.value)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
          No chart data was returned for this range.
        </div>
      )}
    </div>
  );
};

// Main Reports Page Component
const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('thisMonth');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const reports = [
    {
      id: 1,
      title: 'Circulation Report',
      description: 'Track book issues, returns, and circulation trends over time',
      icon: TrendingUp,
      color: 'bg-blue-500',
      category: 'circulation',
      reportType: 'circulation',
    },
    {
      id: 2,
      title: 'Overdue Books Report',
      description: 'List of all overdue books with student details and fine amounts',
      icon: AlertTriangle,
      color: 'bg-red-500',
      category: 'circulation',
      reportType: 'overdue',
    },
    {
      id: 3,
      title: 'Popular Books Report',
      description: 'Most borrowed books and trending titles in your library',
      icon: BookOpen,
      color: 'bg-green-500',
      category: 'collection',
      reportType: 'popular-books',
    },
    {
      id: 4,
      title: 'User Activity Report',
      description: 'Student borrowing patterns and library usage statistics',
      icon: Users,
      color: 'bg-purple-500',
      category: 'users',
      reportType: 'user-activity',
    },
    {
      id: 5,
      title: 'Collection Analysis',
      description: 'Detailed analysis of library collection by genre, author, and year',
      icon: BarChart3,
      color: 'bg-orange-500',
      category: 'collection',
      reportType: 'collection',
    },
    {
      id: 6,
      title: 'Daily Activity Log',
      description: 'Day-to-day operations including issues, returns, and new registrations',
      icon: Activity,
      color: 'bg-teal-500',
      category: 'operations',
      reportType: 'daily-activity',
    },
    {
      id: 7,
      title: 'Fine Collection Report',
      description: 'Summary of fines collected, pending payments, and revenue analysis',
      icon: FileText,
      color: 'bg-yellow-600',
      category: 'financial',
      reportType: 'fine-collection',
    },
    {
      id: 8,
      title: 'Inventory Report',
      description: 'Current stock levels, missing books, and inventory status',
      icon: PieChart,
      color: 'bg-indigo-500',
      category: 'collection',
      reportType: 'inventory',
    },
  ];

  const handleApplyFilter = () => {
    setRefreshKey((value) => value + 1);
    setIsFilterApplied(true);
    setTimeout(() => setIsFilterApplied(false), 1800);
  };

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

            <button
              onClick={handleApplyFilter}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${isFilterApplied ? 'bg-green-600 text-white shadow-md' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
            >
              <Filter className="w-5 h-5" />
              <span>{isFilterApplied ? 'Filter Applied' : 'Apply Filter'}</span>
            </button>
          </div>
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
              {reports.filter((r) => r.category === 'circulation').map((report) => (
                <ReportCard
                  key={report.id}
                  {...report}
                  onClick={() => setSelectedReport(report)}
                />
              ))}
            </div>
          </div>

          {/* Collection Reports */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Collection Reports</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.filter((r) => r.category === 'collection').map((report) => (
                <ReportCard
                  key={report.id}
                  {...report}
                  onClick={() => setSelectedReport(report)}
                />
              ))}
            </div>
          </div>

          {/* User Reports */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Reports</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.filter((r) => r.category === 'users').map((report) => (
                <ReportCard
                  key={report.id}
                  {...report}
                  onClick={() => setSelectedReport(report)}
                />
              ))}
            </div>
          </div>

          {/* Financial Reports */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Reports</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.filter((r) => r.category === 'financial').map((report) => (
                <ReportCard
                  key={report.id}
                  {...report}
                  onClick={() => setSelectedReport(report)}
                />
              ))}
            </div>
          </div>

          {/* Operations Reports */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Operations Reports</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.filter((r) => r.category === 'operations').map((report) => (
                <ReportCard
                  key={report.id}
                  {...report}
                  onClick={() => setSelectedReport(report)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ReportPreviewModal
        isOpen={selectedReport !== null}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
        filters={{ dateRange, startDate, endDate, refreshKey }}
      />
    </div>
  );
};

export default ReportsPage;