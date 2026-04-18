import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { 
  BookOpen, 
  Search,
  Calendar,
  User,
  X,
  RotateCcw,
  ArrowRight,
  Filter,
  Download
} from 'lucide-react';
// import { use } from 'react';


const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });


// Issue Book Modal Component
const IssueBookModal = ({ isOpen, onClose, onIssue }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    bookIsbn: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: ''
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onIssue(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Issue Book</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student ID *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                required
                value={formData.studentId}
                onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter student ID"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book ISBN or Title *
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                required
                value={formData.bookIsbn}
                onChange={(e) => setFormData({...formData, bookIsbn: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Scan barcode or enter ISBN/title"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter book genre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Status *
              </label>
              <input
                type="text"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Default loan period is 14 days. Students can renew once if no reservations exist.
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>Issue Book</span>
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


// Transaction Row Component
const TransactionRow = ({
  transaction,
  mode, // 'ISSUE_REQUESTS' | 'ACTIVE' | 'HISTORY'
  onApproveIssue,
  onReject,
  onReturn,
  formatDate,
}) => {
  const renderStatusBadge = () => {
    if (mode === 'ISSUE_REQUESTS') {
      return <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              transaction.status === 'Available'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {transaction.status}
            </span>;
    }

    const status = transaction.status;
    const statusColors = {
      'on time': 'bg-blue-100 text-blue-700',
      'due soon': 'bg-orange-100 text-orange-700',
      'overdue': 'bg-red-100 text-red-700'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
        {status}
      </span>
    );
  };

  const renderActions = () => {
    if (mode === 'ISSUE_REQUESTS') {
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => onApproveIssue(transaction)}
            disabled={transaction.status !== 'Available'}
            className="px-3 py-2 bg-green-500 text-white rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(transaction)}
            className="px-3 py-2 bg-red-500 text-white rounded-md text-sm"
          >
            Reject
          </button>
        </div>
      );
    }

    if (mode === 'ACTIVE') {
      return (
        <button
          onClick={() => onReturn(transaction)}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Return</span>
        </button>
      );
    }

    return <span className="text-gray-500 text-sm">-</span>;
  };

  const renderColumns = () => {
    if (mode === 'ISSUE_REQUESTS') {
      return (
        <>
          <td className="px-6 py-4 text-gray-700">{transaction.genre}</td>
        </>
      );
    }

    if (mode === 'ACTIVE') {
      return (
        <>
          <td className="px-6 py-4 text-gray-700">{formatDate(transaction.issueDate)}</td>
          <td className="px-6 py-4 text-gray-700">{formatDate(transaction.dueDate)}</td>
        </>
      );
    }

    // HISTORY mode
    return (
      <>
        <td className="px-6 py-4 text-gray-700">{formatDate(transaction.issueDate)}</td>
        <td className="px-6 py-4 text-gray-700">
          {transaction.returnDate ? formatDate(transaction.returnDate) : '-'}
        </td>
      </>
    );
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4">
        <p className="font-semibold">{transaction.studentName}</p>
        <p className="text-sm text-gray-600">{transaction.studentId}</p>
      </td>

      <td className="px-6 py-4">
        <p className="font-medium">{transaction.bookTitle}</p>
        <p className="text-sm text-gray-600">{transaction.isbn}</p>
      </td>

      {renderColumns()}

      <td className="px-6 py-4">
        {renderStatusBadge()}
      </td>

      <td className="px-6 py-4">
        {renderActions()}
      </td>
    </tr>
  );
};



const IssueReturnPage = () => {
  const [activeTab, setActiveTab] = useState('ISSUE_REQUESTS');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const itemsPerPage = 7;

  /* -------------------- API -------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = '';
        let params = {
          page,
          limit: itemsPerPage,
          search
        };

        if (activeTab === 'ISSUE_REQUESTS') {
          url = '/user/requests';
        } else {
          url = '/user/transactions';
          params.active = activeTab === 'ACTIVE';
        }

        const res = await api.get(url, {
          params,
          withCredentials: true
        });

        console.log(`${activeTab} Data:`, res.data);
        setData(res.data.data || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        console.error(`Error fetching ${activeTab}:`, err);
      }
    };

    fetchData();
  }, [activeTab, page, search]);

  /* -------------------- Handlers -------------------- */

  const handleApproveIssue = async (request) => {
    try {
      const res = await api.post(
        `/book/${request.book_id}/issue`,
        { requestId: request.request_id },
        { withCredentials: true }
      );
      console.log('Issue approved:', res.data);
      // Refresh data
      setPage(1);
    } catch (err) {
      console.error('Error approving issue:', err);
    }
  };

  const handleReject = async (request) => {
    try {
      const res = await api.put(
        `/user/requests/${request.request_id}`,
        { status: 'cancelled' },
        { withCredentials: true }
      );
      console.log('Request rejected:', res.data);
      // Refresh data
      setPage(1);
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  };

  const handleReturn = (transaction) => {
    setSelectedTransaction(transaction);
    setShowReturnModal(true);
  };

  const handleReturnComplete = (data) => {
    console.log('Return completed:', data);
  };

  /* -------------------- Filtering & Search -------------------- */

  const filteredData = data.filter(item => {
    if (!search) return true;
    
    const q = search.toLowerCase();
    return (
      item.studentName?.toLowerCase().includes(q) ||
      item.studentId?.toLowerCase().includes(q) ||
      item.bookTitle?.toLowerCase().includes(q) ||
      item.isbn?.toLowerCase().includes(q)
    );
  });

  /* -------------------- Render List -------------------- */

  const renderRows = () =>
    filteredData.map(txn => (
      <TransactionRow
        key={txn.transaction_id || txn.request_id || txn.id}
        transaction={txn}
        mode={activeTab}
        onApproveIssue={handleApproveIssue}
        onReject={handleReject}
        onReturn={handleReturn}
        formatDate={formatDate}
      />
    ));

  return (
    <>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Issue & Return Management</h1>
          <p className="text-gray-600">Manage book circulation and track transactions</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            
            {/* Search */}
            <div className="relative flex-1 h-10">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={`Search ${activeTab.toLowerCase().replace('_', ' ')}`}
                className="w-full h-full pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
        
            {/* Actions */}
            <div className="flex shrink-0 gap-3">
              <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
        
              <button
                onClick={() => setShowIssueModal(true)}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Issue Book</span>
              </button>
            </div>
          </div>
        </div>


        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {[
              ['ISSUE_REQUESTS', 'Issue Requests'],
              ['ACTIVE', 'Active Transactions'],
              ['HISTORY', 'Return History']
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => {setActiveTab(key); setPage(1);}}
                className={`py-4 border-b-2 ${
                  activeTab === key
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-base font-bold text-gray-900">Student</th>
                <th className="px-6 py-4 text-base font-bold text-gray-900">Book</th>
                {activeTab === 'ISSUE_REQUESTS' ? (
                  <>
                    <th className="px-6 py-4 text-base font-bold text-gray-900">Genre</th>
                    <th className="px-6 py-4 text-base font-bold text-gray-900">Book Status</th>
                  </>
                ) : activeTab === 'ACTIVE' ? (
                  <>
                    <th className="px-6 py-4 text-base font-bold text-gray-900">Issue Date</th>
                    <th className="px-6 py-4 text-base font-bold text-gray-900">Due Date</th>
                    <th className="px-6 py-4 text-base font-bold text-gray-900">Status</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-base font-bold text-gray-900">Issue Date</th>
                    <th className="px-6 py-4 text-base font-bold text-gray-900">Return Date</th>
                    <th className="px-6 py-4 text-base font-bold text-gray-900">Status</th>
                  </>
                )}
                <th className="px-6 py-4 text-base font-bold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>{renderRows()}</tbody>
          </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredData.length} of {total} results
            </p>
            <div className="flex space-x-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg">{page}</button>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={filteredData.length < itemsPerPage}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <IssueBookModal
        isOpen={showIssueModal}
        onClose={() => setShowIssueModal(false)}
      />
    </div>
    </>
  );
};

export default IssueReturnPage;
