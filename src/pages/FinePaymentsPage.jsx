import { useState } from 'react';
import { 
  DollarSign,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Eye,
  X,
  Calendar,
  BookOpen,
  User,
  Receipt,
  Filter,
  Search,
  TrendingDown,
  Wallet
} from 'lucide-react';

// Payment Method Card Component
const PaymentMethodCard = ({ method, icon: Icon, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
      isSelected 
        ? 'border-purple-500 bg-purple-50' 
        : 'border-gray-200 hover:border-purple-300 bg-white'
    }`}
  >
    <div className="flex items-center space-x-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        isSelected ? 'bg-purple-500' : 'bg-gray-100'
      }`}>
        <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
      </div>
      <span className={`font-medium ${isSelected ? 'text-purple-700' : 'text-gray-900'}`}>
        {method}
      </span>
    </div>
  </button>
);

// Fine Item Card Component
const FineItemCard = ({ fine, onPay, onView }) => {
  const isOverdue = fine.status === 'Pending';
  
  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all duration-300 hover:shadow-md ${
      isOverdue ? 'border-red-200' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isOverdue ? 'bg-red-100' : 'bg-green-100'
          }`}>
            <BookOpen className={`w-6 h-6 ${isOverdue ? 'text-red-600' : 'text-green-600'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{fine.bookTitle}</h3>
            <p className="text-sm text-gray-600">{fine.isbn}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          isOverdue 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {fine.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-600">Due Date</p>
          <p className="font-medium text-gray-900">{fine.dueDate}</p>
        </div>
        <div>
          <p className="text-gray-600">Days Overdue</p>
          <p className="font-medium text-gray-900">{fine.daysOverdue} days</p>
        </div>
        <div>
          <p className="text-gray-600">Fine Rate</p>
          <p className="font-medium text-gray-900">${fine.fineRate}/day</p>
        </div>
        <div>
          <p className="text-gray-600">Total Amount</p>
          <p className="font-bold text-red-600 text-lg">${fine.amount}</p>
        </div>
      </div>

      <div className="flex space-x-3">
        {isOverdue && (
          <button
            onClick={() => onPay(fine)}
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay Now</span>
          </button>
        )}
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
};

// Payment Modal Component
const PaymentModal = ({ isOpen, onClose, fines, totalAmount }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  if (!isOpen) return null;

  const handlePayment = () => {
    console.log('Processing payment:', { paymentMethod, totalAmount });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Payment Summary */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white mb-6">
            <p className="text-sm opacity-90 mb-2">Total Amount Due</p>
            <h3 className="text-4xl font-bold mb-4">${totalAmount.toFixed(2)}</h3>
            <div className="flex items-center space-x-2 text-sm opacity-90">
              <Receipt className="w-4 h-4" />
              <span>{Array.isArray(fines) ? fines.length : 1} fine(s) to pay</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
            <div className="grid grid-cols-3 gap-4">
              <PaymentMethodCard
                method="Card"
                icon={CreditCard}
                isSelected={paymentMethod === 'card'}
                onClick={() => setPaymentMethod('card')}
              />
              <PaymentMethodCard
                method="Wallet"
                icon={Wallet}
                isSelected={paymentMethod === 'wallet'}
                onClick={() => setPaymentMethod('wallet')}
              />
              <PaymentMethodCard
                method="Bank"
                icon={DollarSign}
                isSelected={paymentMethod === 'bank'}
                onClick={() => setPaymentMethod('bank')}
              />
            </div>
          </div>

          {/* Card Payment Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    maxLength="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    maxLength="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'wallet' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                You will be redirected to your digital wallet to complete the payment.
              </p>
            </div>
          )}

          {paymentMethod === 'bank' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                Bank transfer details will be provided after confirmation.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handlePayment}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Pay ${totalAmount.toFixed(2)}</span>
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

// Fine Details Modal Component
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
                <p className="text-sm text-gray-600 mb-1">Issue Date</p>
                <p className="font-semibold text-gray-900">{fine.issueDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Due Date</p>
                <p className="font-semibold text-gray-900">{fine.dueDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Return Date</p>
                <p className="font-semibold text-gray-900">{fine.returnDate || 'Not Returned'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Days Overdue</p>
                <p className="font-semibold text-gray-900">{fine.daysOverdue} days</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 mb-1">Fine Calculation</p>
                <p className="text-gray-900">
                  {fine.daysOverdue} days × ${fine.fineRate}/day
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-red-700 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-red-600">${fine.amount}</p>
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

// Transaction Row Component
const TransactionRow = ({ transaction }) => (
  <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          transaction.type === 'Payment' ? 'bg-green-100' : 'bg-blue-100'
        }`}>
          {transaction.type === 'Payment' ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <DollarSign className="w-5 h-5 text-blue-600" />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900">{transaction.description}</p>
          <p className="text-sm text-gray-600">{transaction.date}</p>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        transaction.status === 'Completed' 
          ? 'bg-green-100 text-green-700'
          : transaction.status === 'Pending'
          ? 'bg-yellow-100 text-yellow-700'
          : 'bg-red-100 text-red-700'
      }`}>
        {transaction.status}
      </span>
    </td>
    <td className="px-6 py-4 text-gray-700">{transaction.method}</td>
    <td className="px-6 py-4">
      <span className={`font-semibold ${
        transaction.type === 'Payment' ? 'text-green-600' : 'text-gray-900'
      }`}>
        {transaction.type === 'Payment' ? '-' : '+'}${transaction.amount}
      </span>
    </td>
    <td className="px-6 py-4">
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <Download className="w-4 h-4 text-gray-600" />
      </button>
    </td>
  </tr>
);

// Main Fines & Payments Page Component
const FinesPaymentsPage = () => {
  const [activeTab, setActiveTab] = useState('outstanding');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [payingFines, setPayingFines] = useState([]);

  const outstandingFines = [
    {
      id: 1,
      bookTitle: 'The Great Gatsby',
      isbn: '978-0-7432-7356-5',
      issueDate: '2025-01-15',
      dueDate: '2025-01-29',
      returnDate: null,
      daysOverdue: 15,
      fineRate: 0.50,
      amount: 7.50,
      status: 'Pending'
    },
    {
      id: 2,
      bookTitle: 'To Kill a Mockingbird',
      isbn: '978-0-06-112008-4',
      issueDate: '2025-01-20',
      dueDate: '2025-02-03',
      returnDate: null,
      daysOverdue: 10,
      fineRate: 0.50,
      amount: 5.00,
      status: 'Pending'
    }
  ];

  const paidFines = [
    {
      id: 3,
      bookTitle: '1984',
      isbn: '978-0-452-28423-4',
      issueDate: '2025-01-05',
      dueDate: '2025-01-19',
      returnDate: '2025-01-25',
      daysOverdue: 6,
      fineRate: 0.50,
      amount: 3.00,
      status: 'Paid'
    }
  ];

  const transactions = [
    { id: 1, description: 'Fine Payment - The Great Gatsby', date: '2025-03-15', type: 'Payment', status: 'Completed', method: 'Credit Card', amount: 7.50 },
    { id: 2, description: 'Fine Payment - 1984', date: '2025-03-10', type: 'Payment', status: 'Completed', method: 'Debit Card', amount: 3.00 },
    { id: 3, description: 'Fine Assessed - Pride and Prejudice', date: '2025-03-05', type: 'Fine', status: 'Pending', method: 'N/A', amount: 5.00 },
    { id: 4, description: 'Fine Payment - Clean Code', date: '2025-02-28', type: 'Payment', status: 'Completed', method: 'Bank Transfer', amount: 4.50 }
  ];

  const totalOutstanding = outstandingFines.reduce((sum, fine) => sum + fine.amount, 0);
  const totalPaid = paidFines.reduce((sum, fine) => sum + fine.amount, 0);

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

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fines & Payments</h1>
          <p className="text-gray-600">Manage your library fines and payment history</p>
        </div>

        {/* Pay All Button */}
        {totalOutstanding > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Quick Payment
                </h3>
                <p className="text-gray-600">
                  Pay all outstanding fines at once and save time
                </p>
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

        {/* Tabs */}
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
                onClick={() => setActiveTab('paid')}
                className={`py-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'paid'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Paid Fines ({paidFines.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'history'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Transaction History
              </button>
            </div>
          </div>
        </div>

        {/* Outstanding Fines Tab */}
        {activeTab === 'outstanding' && (
          <div className="grid md:grid-cols-2 gap-6">
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

        {/* Paid Fines Tab */}
        {activeTab === 'paid' && (
          <div className="grid md:grid-cols-2 gap-6">
            {paidFines.map((fine) => (
              <FineItemCard
                key={fine.id}
                fine={fine}
                onPay={handlePaySingle}
                onView={handleViewDetails}
              />
            ))}
          </div>
        )}

        {/* Transaction History Tab */}
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
                  {transactions.map((transaction) => (
                    <TransactionRow key={transaction.id} transaction={transaction} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        fines={payingFines}
        totalAmount={payingFines.reduce((sum, fine) => sum + fine.amount, 0)}
      />

      <FineDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        fine={selectedFine}
      />
    </div>
  );
};

export default FinesPaymentsPage;