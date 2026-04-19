import { useState } from 'react';
import { 
  BookOpen, 
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  MoreVertical,
  X,
  Save,
  Image,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useEffect } from 'react';
import api from '../api/axiosInstance.js';
import { toast } from 'react-toastify';

const createEmptyBookForm = () => ({
  title: '',
  image: '',
  author: '',
  ISBN: '',
  genre: '',
  year: '',
  pages: '',
  language: 'English',
  total_copy: '',
  issued_copy: 0,
  location: '',
  description: '',
});

const normalizeBookFormData = (book = null) => {
  const emptyForm = createEmptyBookForm();

  if (!book) {
    return emptyForm;
  }

  return {
    ...emptyForm,
    ...book,
    image: book.image ?? '',
    title: book.title ?? '',
    author: book.author ?? '',
    ISBN: book.ISBN ?? book.isbn ?? '',
    genre: book.genre ?? '',
    year: book.year ?? book.publicationYear ?? '',
    pages: book.pages ?? '',
    language: book.language ?? 'English',
    total_copy: book.total_copy ?? book.quantity ?? '',
    issued_copy: book.issued_copy ?? 0,
    location: book.location ?? '',
    description: book.description ?? '',
  };
};


const BookModal = ({ isOpen, onClose, book, onSave }) => {
  const [formData, setFormData] = useState(() => normalizeBookFormData(book));
  const CLOUD_NAME = "dirsttw39";

  useEffect(() => {
    setFormData(normalizeBookFormData(book));
  }, [book]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {book ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Book Cover Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Cover
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
              {book?.image ? (
                <div>
                <img
                  src={book.image ? `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${book.image}` : "/book.png"}
                  alt={book.title}
                  className="w-32 h-44 mx-auto object-cover border border-gray-300 rounded-lg shadow-sm"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null; // prevent infinite loop
                    e.target.src = "/book.png"; // fallback placeholder
                  }}
                />
                <p className='text-gray-600 mt-2'>{book.image}</p>
                </div>
              ) : (
                <div>
                  <Image className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 500KB</p>
                </div>
              )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter book title"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter author name"
              />
            </div>

            {/* ISBN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN *
              </label>
              <input
                type="text"
                required
                value={formData.ISBN}
                onChange={(e) => setFormData({...formData, ISBN: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="978-0-123456-78-9"
              />
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre *
              </label>
              <select
                required
                value={formData.genre}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select genre</option>
                <option>Fiction</option>
                <option>Non-Fiction</option>
                <option>Science</option>
                <option>History</option>
                <option>Biography</option>
                <option>Technology</option>
              </select>
            </div>


            {/* Publication Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publication Year
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="2024"
              />
            </div>

            {/* Pages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Pages
              </label>
              <input
                type="number"
                value={formData.pages}
                onChange={(e) => setFormData({...formData, pages: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="300"
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Other</option>
              </select>
            </div>

            {/* Total Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Quantity *
              </label>
              <input
                type="number"
                required
                value={formData.total_copy}
                onChange={(e) => setFormData({...formData, total_copy: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="10"
              />
            </div>

            {/* Available Copies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Copies *
              </label>
              <input
                type="number"
                readOnly
                value={Math.max(Number(formData.total_copy || 0) - Number(formData.issued_copy || 0), 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="8"
              />
            </div>

            {/* Shelf Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shelf Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="A-12-3"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter book description..."
              />
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{book ? 'Update Book' : 'Add Book'}</span>
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


const BookTableRow = ({ book, onEdit, onDelete, onView }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{book.title}</p>
            <p className="text-sm text-gray-600">{book.author}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-700">{book.ISBN}</td>
      <td className="px-6 py-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {book.genre}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-700">{book.year}</td>
      <td className="px-6 py-4">
        <div className="text-center">
          <p className="font-semibold text-gray-900">{book.issued_copy}/{book.total_copy}</p>
          <p className="text-xs text-gray-500">available</p>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          book.status == 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {book.status}
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
                onClick={() => { onView(book); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
              <button
                onClick={() => { onEdit(book); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => { onDelete(book); setShowMenu(false); }}
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

// Main Book Catalog Component
const BookCatalogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [books, setbooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalBooks, setTotalBooks] = useState(0);

  const totalPages = Math.ceil(totalBooks / limit);

  const genreOptions = [
    'Fiction', 'Non-Fiction', 'Science', 'History',
    'Biography', 'Technology', 'Arts', 'Philosophy'
  ];

  // Fetch books (only when Enter is pressed)
  const fetchBooks = async (searchTermSubmitted = '', newPage = page) => {
    setLoading(true);
    setError(null);
  
    try {
      const params = { page: newPage, limit };
  
      const trimmed = searchTermSubmitted.trim();
      if (trimmed) params.bookName = trimmed;
  
      const response = await api.get('/books', {
        params,
        withCredentials: true,
      });
  
      const payload = response?.data || {};
      const booksData = payload.books || payload.data || payload || [];
  
      setbooks(booksData);
      setTotalBooks(payload.totalBooks ?? booksData.length ?? 0);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter press
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setPage(1);
      fetchBooks(searchQuery, 1);
    }
  };

  // Fetch on page change
  useEffect(() => {
    fetchBooks(searchQuery, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);


  const handleAddBook = () => {
    setEditingBook(null);
    setShowModal(true);
  };

  const handleEditBook = async(book) => {
    try {
      const response = await api.get(`/books/${book.book_id}`, { withCredentials: true });
      const bookData = response.data;
      console.log(bookData);
      setEditingBook(bookData);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching book details:', error);
    }
  };

  const handleSaveBook = async (bookData) => {
    try {
      if (editingBook) {
        // Edit book
        await api.put(`/books/${editingBook.book_id}`, bookData, { withCredentials: true });
        toast.success('Book updated successfully');
      } else {
        // Add book
        await api.post('/books', bookData, { withCredentials: true });
        toast.success('Book added successfully');
      }
      // Refresh books
      fetchBooks(searchQuery, page);
    } catch (err) {
      console.error('Error saving book:', err);
      setError(err.message || 'Failed to save book');
    }
  };

  const handleDeleteBook = async (book) => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        await api.delete(`/books/${book.book_id}`, { withCredentials: true });
        // Refresh books
        fetchBooks(searchQuery, page);
      } catch (err) {
        console.error('Error deleting book:', err);
        setError(err.message || 'Failed to delete book');
      }
    }
  };

  const filteredBooks = books.filter(book => {
    // ---- GENRE MATCH ----
    const matchesGenre =
      selectedGenre === 'All Genres' ||
      book.genre === selectedGenre;

    // ---- STATUS MATCH ----
    const bookStatus = book.status;

    const matchesStatus =
      selectedStatus === 'All Status' ||
      selectedStatus === bookStatus;

    return matchesGenre && matchesStatus;
  });


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Catalog</h1>
          <p className="text-gray-600">Manage your library's book collection</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:gap-6">
            <div className="flex-1 flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by title, author, ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option>All Genres</option>
                {genreOptions.map((genre) => (
                  <option key={genre}>{genre}</option>
                ))}
              </select>

              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>All Status</option>
                <option>Available</option>
                <option>Not Available</option>
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
              <button onClick={handleAddBook} className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add Book</span>
              </button>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Book Details</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">ISBN</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Genre</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Year</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Copies</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="loader mb-4"></div>
                        <p>Loading books...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-red-500">
                      <p>Error: {error}</p>
                    </td>
                  </tr>
                ) : filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <p>No books found matching your criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book) => (
                    <BookTableRow key={book.book_id} book={book} onEdit={handleEditBook} onDelete={handleDeleteBook} onView={(book) => console.log('View:', book)} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">{`Showing ${filteredBooks.length} of ${totalBooks} books`}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>

                <span className="text-gray-700 font-medium pt-2 rounded-lg">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              </div>
            )}
        </div>
      </div>

      <BookModal isOpen={showModal} onClose={() => setShowModal(false)} book={editingBook} onSave={handleSaveBook} />
    </div>
  );
};

export default BookCatalogPage;
