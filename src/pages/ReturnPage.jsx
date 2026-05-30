import { useState, useEffect, useMemo } from 'react';
import { IssuedBookCard } from '../components/UIcomponents'; 
import PaymentHandler from '../components/PaymentHandler';
import api from '../api/axiosInstance';
import { toast } from "react-toastify";
import { Button, FormInput } from "../components/UIcomponents";
import { 
  RotateCcw, 
  Search, 
  CheckCircle
} from 'lucide-react';


// Return Book Form Component
const ReturnBookForm = ({ selectedBook, onReturn, onCancel }) => {
  const returnDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
  if (!selectedBook) return null;
  const [loading, setLoading] = useState(false);


  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
          <RotateCcw className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Return Book</h2>
      </div>

      <div className="space-y-6">
        {/* ISBN Number */}
        <div className="pb-2">
          <label className="pl-2 text-left block text-sm font-medium text-gray-700">
            ISBN Number
          </label>
          <input
            type="text"
            value={selectedBook.isbn}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>

        {/* Book Title */}
        <div className="pb-2">
          <label className="pl-2 text-left block text-sm font-medium text-gray-700">
            Book Title
          </label>
          <input
            type="text"
            value={selectedBook.title}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>

        {/* Issue Date and Due Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="pb-2">
            <label className="pl-2 text-left block text-sm font-medium text-gray-700">
              Issue Date
            </label>
            <input
              type="text"
              value={new Date(selectedBook.issueDate).toISOString().split('T')[0]}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
          <div className="pb-2">
            <label className="pl-2 text-left block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="text"
              value={new Date(selectedBook.dueDate).toISOString().split('T')[0]}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
        </div>

        {/* Return Date */}
        <div className="pb-2">
          <label className="pl-2 text-left block text-sm font-medium text-gray-700">
            Return Date
          </label>
          <input
            type="date"
            value={returnDate}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Penalty Info */}
        {selectedBook?.penalty?.amount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="font-semibold text-red-800">Penalty Due</p>
            <p className="text-sm text-red-700">Amount: ${selectedBook.penalty.amount} ({selectedBook.penalty.days} days overdue)</p>
            <p className="text-sm text-yellow-700">Payment will be required after return.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <Button
            onClick={onReturn}
            variant="primary"
            disabled={loading}
          >
            {loading ? "Returning..." : "Return Book"}
          </Button>
          <Button
            onClick={onCancel}
            variant="secondary"
          >
            Cancel
          </Button> 
        </div>
      </div>
    </div>
  );
};

// Main Return Books Page Component
const ReturnBooksPage = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState('All Books');
  const [issuedBooks, setissuedBooks] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentDays, setPaymentDays] = useState(0);
  const [paymentID, setPaymentID] = useState(null);

  // Compute filtered books based on searchQuery and filterOption
  const filteredIssuedBooks = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (issuedBooks || []).filter((book) => {
      // Search match: title, author or isbn
      if (q) {
        const title = (book.title || '').toLowerCase();
        const author = (book.author || '').toLowerCase();
        const isbn = (book.isbn || '').toLowerCase();
        if (!title.includes(q) && !author.includes(q) && !isbn.includes(q)) {
          return false;
        }
      }

      // Date-based filtering
      if (!book.dueDate) {
        // If no due date, only include for 'All Books'
        return filterOption === 'All Books';
      }

      const due = new Date(book.dueDate);
      // normalize to midnight
      due.setHours(0, 0, 0, 0);
      const msPerDay = 1000 * 60 * 60 * 24;
      const daysUntilDue = Math.ceil((due - today) / msPerDay);

      switch (filterOption) {
        case 'Overdue':
          return due < today;
        case 'Due Soon':
          // due today or within next 3 days
          return daysUntilDue >= 0 && daysUntilDue <= 3;
        case 'On Time':
          // due later than 3 days from today
          return daysUntilDue > 3;
        default:
          return true; // All Books
      }
    });
  }, [issuedBooks, searchQuery, filterOption]);

  // If the currently selected book is filtered out, clear the selection
  useEffect(() => {
    const selectedId = selectedBook?.id;
    if (selectedId && !filteredIssuedBooks.some((b) => b.id === selectedId)) {
      setSelectedBook(null);
    }
  }, [filteredIssuedBooks, selectedBook]);

  const fetchIssuedBooks = async () => {
    try {

      const response = await api.get('/users/me/books', {
        credentials: "include",
      });
      if (response.status !== 200) {
        throw new Error("Failed to fetch issued books");
      }
      // console.log(data);
      setissuedBooks(response.data || []); // Assuming the API returns a 'books' key
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchIssuedBooks();
  }, []);


  const handleReturn = async (e) => {
    try {
      const response = await api.patch(`/books/${selectedBook.id}/returns`, { ...selectedBook }, { withCredentials: true });
      
      if (response.status === 200) {
      toast.success(response.data.message);
      setSelectedBook(null);
      fetchIssuedBooks();

      // Check for penalty in the book
      if (response.data.paymentId) {
        setPaymentAmount(response.data.paymentAmount);
        setPaymentDays(response.data.paymentDays);
        setPaymentID(response.data.paymentId);
        setShowPaymentModal(true);
      }
    }
    } catch (err) {
      console.log(err);
      toast.error("Unable to return the book!");
    }
  };

  const handleCancel = () => {
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex flex-col items-center justify-center">
          <div className="flex items-center space-x-4 mb-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Return Books</h1>
              <p className="text-gray-600">Select a book from your issued collection to return it to the library</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by book title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <select 
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white min-w-[140px]"
            >
              <option>All Books</option>
              <option>Overdue</option>
              <option>Due Soon</option>
              <option>On Time</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Issued Books List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Issued Books</h2>
              <span className="px-4 py-2 bg-purple-500 text-white rounded-full text-sm font-medium">
                {issuedBooks.length} books issued
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {filteredIssuedBooks.map((book) => {
                const bookId = book.id;
                const selectedId = selectedBook?.id || selectedBook?._id;
                return (
                  <IssuedBookCard
                    key={bookId}
                    book={book}
                    isSelected={selectedId === bookId}
                    onSelect={setSelectedBook}
                  />
                );
              })}
            </div>
          </div>

          {/* Return Form Sidebar */}
          <div className="lg:col-span-1">
            {selectedBook ? (
              <ReturnBookForm
                selectedBook={selectedBook}
                onReturn={handleReturn}
                onCancel={handleCancel}
                penalty={selectedBook?.penalty?.amount || 0}
                days={selectedBook?.penalty?.days || 0}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Book</h3>
                <p className="text-gray-600 text-sm">
                  Click on a book from your issued collection to return it
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentHandler
          amount={paymentAmount}
          days={paymentDays}
          payment_id={paymentID}
          onPaid={() => {
            toast.success("Fine paid successfully!");
            setShowPaymentModal(false);
          }}
          onCancel={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default ReturnBooksPage;
