import { useEffect, useState } from 'react';
import {
  CreditCard,
  CheckCircle,
  Download,
  Eye,
  X,
  BookOpen,
} from 'lucide-react';
import { toast } from 'react-toastify';
import PaymentHandler from '../components/PaymentHandler.jsx';
import api from '../api/axiosInstance.js';

const OUTSTANDING_LIMIT = 20;
const HISTORY_LIMIT = 20;

const formatDate = (value) => {
  if (!value) return 'N/A';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const mapFineRecord = (fine) => ({
  id: fine.id,
  bookTitle: fine.title || 'Unknown Book',
  isbn: fine.ISBN || 'N/A',
  fineDate: formatDate(fine.date),
  amount: Number(fine.amount || 0),
  status: fine.is_paid ? 'Paid' : 'Pending',
  reason: fine.reason || 'Library fine',
  method: fine.method || 'N/A',
  paymentId: fine.paymentId || 'N/A',
});

const FineItemCard = ({ fine, onPay, onView }) => (
  <div className="bg-white rounded-xl shadow-sm border-2 border-red-200 p-6 transition-all duration-300 hover:shadow-md">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-100">
          <BookOpen className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{fine.bookTitle}</h3>
          <p className="text-sm text-gray-600">{fine.isbn}</p>
        </div>
      </div>
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
        {fine.status}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
      <div>
        <p className="text-gray-600">Fine Date</p>
        <p className="font-medium text-gray-900">{fine.fineDate}</p>
      </div>
      <div>
        <p className="text-gray-600">Reason</p>
        <p className="font-medium text-gray-900">{fine.reason}</p>
      </div>
      <div>
        <p className="text-gray-600">Payment Method</p>
        <p className="font-medium text-gray-900">{fine.method}</p>
      </div>
      <div>
        <p className="text-gray-600">Total Amount</p>
        <p className="font-bold text-red-600 text-lg">${fine.amount.toFixed(2)}</p>
      </div>
    </div>

    <div className="flex space-x-3">
      <button
        onClick={() => onPay(fine)}
        className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
      >
        <CreditCard className="w-4 h-4" />
        <span>Pay Now</span>
      </button>
      <button
        onClick={() => onView(fine)}
        className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors flex items-center space-x-2"
      >
        <Eye className="w-4 h-4" />
        <span>View Details</span>
      </button>
    </div>
  </div>
);

const FineDetailsModal = ({ isOpen, onClose, fine }) => {
  if (!isOpen || !fine) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Fine Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Book Title</p>
                <p className="font-semibold text-gray-900">{fine.bookTitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">ISBN</p>
                <p className="font-semibold text-gray-900">{fine.isbn}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Fine Date</p>
                <p className="font-semibold text-gray-900">{fine.fineDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                <p className="font-semibold text-gray-900">{fine.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Reason</p>
                <p className="font-semibold text-gray-900">{fine.reason}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                <p className="font-semibold text-gray-900">{fine.method}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Reference</p>
                <p className="font-semibold text-gray-900">{fine.paymentId}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 mb-1">Fine Summary</p>
                <p className="text-gray-900">{fine.reason}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-red-700 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-red-600">${fine.amount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 border border-gray-300 hover:bg-gray-50 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const TransactionRow = ({ transaction }) => (
  <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{transaction.description}</p>
          <p className="text-sm text-gray-600">{transaction.date}</p>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
        {transaction.status}
      </span>
    </td>
    <td className="px-6 py-4 text-gray-700">{transaction.method}</td>
    <td className="px-6 py-4">
      <span className="font-semibold text-green-600">-${transaction.amount.toFixed(2)}</span>
    </td>
    <td className="px-6 py-4">
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <Download className="w-4 h-4 text-gray-600" />
      </button>
    </td>
  </tr>
);

const FinesPaymentsPage = () => {
  const [activeTab, setActiveTab] = useState('outstanding');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [payingFines, setPayingFines] = useState([]);
  const [outstandingFines, setOutstandingFines] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loadingOutstanding, setLoadingOutstanding] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchOutstandingFines = async () => {
    try {
      setLoadingOutstanding(true);

      const response = await api.get('/users/me/fines', {
        params: {
          status: 'unpaid',
          page: 1,
          limit: OUTSTANDING_LIMIT,
        },
        withCredentials: true,
      });

      setOutstandingFines((response.data?.records || []).map(mapFineRecord));
    } catch (error) {
      console.error('Error fetching outstanding fines:', error);
      toast.error('Unable to load outstanding fines.');
    } finally {
      setLoadingOutstanding(false);
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      setLoadingHistory(true);

      const response = await api.get('/users/me/fines', {
        params: {
          status: 'paid',
          page: 1,
          limit: HISTORY_LIMIT,
        },
        withCredentials: true,
      });

      const paidFines = (response.data?.records || []).map(mapFineRecord);
      setTransactionHistory(
        paidFines.map((fine) => ({
          id: fine.id,
          description: `Fine Payment - ${fine.bookTitle}`,
          date: fine.fineDate,
          status: 'Completed',
          method: fine.method,
          amount: fine.amount,
        }))
      );
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      toast.error('Unable to load transaction history.');
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchOutstandingFines();
    fetchTransactionHistory();
  }, []);

  const totalOutstanding = outstandingFines.reduce((sum, fine) => sum + fine.amount, 0);
  const paymentAmount = payingFines.reduce((sum, fine) => sum + fine.amount, 0);
  const singleFineId = payingFines.length === 1 ? payingFines[0]?.id : undefined;

  const handlePayAll = () => {
    setPayingFines(outstandingFines);
    setShowPaymentModal(true);
  };

  const handlePaySingle = (fine) => {
    setPayingFines([fine]);
    setShowPaymentModal(true);
  };

  const handleViewDetails = (fine) => {
    setSelectedFine(fine);
    setShowDetailsModal(true);
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    setPayingFines([]);
  };

  const handlePaymentSuccess = async () => {
    handlePaymentClose();
    await Promise.all([fetchOutstandingFines(), fetchTransactionHistory()]);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fines & Payments</h1>
          <p className="text-gray-600">Manage your library fines and payment history</p>
        </div>

        {totalOutstanding > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Quick Payment</h3>
                <p className="text-gray-600">Pay all outstanding fines at once and save time</p>
              </div>
              <button
                onClick={handlePayAll}
                className="px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Pay All (${totalOutstanding.toFixed(2)})</span>
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('outstanding')}
                className={`py-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'outstanding'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Outstanding Fines ({outstandingFines.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'history'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Transaction History ({transactionHistory.length})
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'outstanding' && (
          <div className="grid md:grid-cols-2 gap-6">
            {loadingOutstanding && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-gray-600 md:col-span-2">
                Loading outstanding fines...
              </div>
            )}

            {!loadingOutstanding && outstandingFines.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-gray-600 md:col-span-2">
                No outstanding fines found.
              </div>
            )}

            {outstandingFines.map((fine) => (
              <FineItemCard
                key={fine.id}
                fine={fine}
                onPay={handlePaySingle}
                onView={handleViewDetails}
              />
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Transaction</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Method</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingHistory && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-600">
                        Loading transaction history...
                      </td>
                    </tr>
                  )}

                  {!loadingHistory && transactionHistory.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-600">
                        No transaction history found.
                      </td>
                    </tr>
                  )}

                  {transactionHistory.map((transaction) => (
                    <TransactionRow key={transaction.id} transaction={transaction} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showPaymentModal && (
        <PaymentHandler
          amount={paymentAmount}
          days={payingFines.length}
          payment_id={singleFineId}
          onPaid={handlePaymentSuccess}
          onCancel={handlePaymentClose}
        />
      )}

      <FineDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        fine={selectedFine}
      />
    </div>
  );
};

export default FinesPaymentsPage;
