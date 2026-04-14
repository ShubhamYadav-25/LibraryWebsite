import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { BookCard } from '../components/UIcomponents';
import { Search, Filter, X, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

// ---------------- FILTER SIDEBAR ---------------- //
export const FilterSidebar = ({ genres, setGenres, isOpen }) => {
  const genreOptions = [
    'Fiction', 'Non-Fiction', 'Science', 'History',
    'Biography', 'Technology', 'Arts', 'Philosophy'
  ];

  return (
    <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <button
            onClick={() => setGenres([])}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Clear All
          </button>
        </div>

        {/* Genre Filter */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Genre</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {genreOptions.map((genre) => (
              <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={genres.includes(genre)}
                  onChange={(e) => {
                    if (e.target.checked) setGenres([...genres, genre]);
                    else setGenres(genres.filter(g => g !== genre));
                  }}
                  className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500"
                />
                <span className="text-gray-700">{genre}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------- ACTIVE FILTER TAGS ---------------- //
export const ActiveFilters = ({ genres, setGenres }) => {
  if (genres.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {genres.map((genre, index) => (
        <span
          key={index}
          className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
        >
          <span>{genre}</span>
          <button
            onClick={() => setGenres(genres.filter(g => g !== genre))}
            className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  );
};

// ---------------- MAIN PAGE ---------------- //
const SearchBookPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [genres, setGenres] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalBooks, setTotalBooks] = useState(0);

  const totalPages = Math.ceil(totalBooks / limit);

  // Fetch books (only when Enter is pressed)
  const fetchBooks = async (searchTermSubmitted, newPage = page) => {
    setLoading(true);
    setError(null);

    try {
      const params = { page: newPage, limit };
      const trimmedSubmitted = (searchTermSubmitted || '').trim();
      if (trimmedSubmitted.length > 0) params.bookName = trimmedSubmitted;

      if (genres.length === 1 && genres[0] !== 'All Genres') {
        params.genre = genres[0];
      }

      const response = await api.get('/books/', {
        params,
        withCredentials: true,
      });

      const payload = response?.data || {};
      const booksData = payload.books || [];
      setBooks(booksData);
      setTotalBooks(payload.totalBooks || booksData.length || 0);
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
    if (searchQuery.trim() !== '') {
      fetchBooks(searchQuery, page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Updated the filteredBooks logic to directly match selected genres with book genres.
  const filteredBooks = books.filter(book => {
    const matchesGenre =
      genres.length === 0 ||
      genres.includes(book.genre);
    return matchesGenre;
  });

  // ---------- UI ----------
  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Books</h1>
          <p className="text-gray-600">Discover and explore our extensive collection</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, author, ISBN, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 max-w-5xl">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar genres={genres} setGenres={setGenres} isOpen={showFilters} />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <div className="loader mb-4"></div>
                <p>Loading books...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-8 text-red-500">
                <p>Error: {error}</p>
              </div>
            ) : searchQuery === '' && genres.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500">
                <BookOpen className="w-16 h-16 mb-4 text-purple-400" />
                <h3 className="text-xl font-semibold">Start Your Search</h3>
                <p className="mt-2 text-sm max-w-sm">
                  Discover your next favorite book by searching for a title, author, or keyword using the search bar above.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {totalBooks} Books Found
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Showing results for your search
                    </p>
                  </div>
                </div>

                <ActiveFilters genres={genres} setGenres={setGenres} />

                {/* Book Cards Grid */}
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-[10rem] gap-y-[2rem] auto-rows-fr">
                    {filteredBooks.length > 0 ? (
                      filteredBooks.map((book, index) => (
                        <div key={index} className="flex flex-col h-full">
                          <BookCard book={book} showActions={true} />
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500 col-span-full">
                        <p className="mt-2 text-lg">No books found matching your criteria.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Prev
                    </button>

                    <span className="text-gray-700 font-medium">
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
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBookPage;

