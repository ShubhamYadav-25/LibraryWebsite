import {
  useState,
  useEffect,
  useCallback
} from "react";
import api from "../api/axiosInstance";
import { HorizontalScrollSection } from '../components/UIcomponents';

const normalizeBook = (book) => ({
  ...book,
  ISBN: book.ISBN ?? book.isbn,
  isbn: book.isbn ?? book.ISBN,
  genre: book.genre ?? book.category,
  category: book.category ?? book.genre,
  image: book.image ?? book.image_url,
  image_url: book.image_url ?? book.image,
  is_liked: Boolean(book.is_liked || book.isLiked),
});

const getBooksFromPayload = (section, payload) => {
  if (section === "recommended") {
    return payload?.recommendations || payload?.books || [];
  }

  return payload?.books || [];
};

const ViewBooksPage = () => {
  /* ============================= */
  /* Section States                */
  /* ============================= */
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  const limit = 35;

  const [loading, setLoading] = useState({
    trending: true,
    recommended: true,
    newArrivals: true,
  });

  const fetchBooks = useCallback(
    async (section, apiUrl, pageNum) => {
      try {
        setLoading((prev) => ({ ...prev, [section]: true }));

        const res = await api.get(apiUrl, {
          params: { page: pageNum, limit },
          withCredentials: true,
        });

        if (res.status === 200) {
          const newBooks = getBooksFromPayload(section, res.data).map(
            normalizeBook
          );

          /* Set Data */
          if (section === "trending") {
            setTrendingBooks(newBooks);
          }

          if (section === "recommended") {
            setRecommendedBooks(newBooks);
          }

          if (section === "newArrivals") {
            setNewArrivals(newBooks);
          }
        }
      } catch (err) {
        console.error(`Error fetching ${section} books:`, err);

        if (section === "recommended") {
          try {
            const fallbackRes = await api.get("/books", {
              params: { page: 1, limit },
              withCredentials: true,
            });

            const fallbackBooks = (fallbackRes.data?.books || []).map(
              normalizeBook
            );

            setRecommendedBooks(fallbackBooks);
          } catch (fallbackErr) {
            console.error("Error fetching fallback recommendations:", fallbackErr);
          }
        }
      } finally {
        setLoading((prev) => ({ ...prev, [section]: false }));
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchBooks("trending", `/books/trending`, 1);
    fetchBooks("recommended", `/recommendations`, 1);
    fetchBooks("newArrivals", `/books/new-arrivals`, 1);
  }, [fetchBooks]);

  /* ============================= */
  /* JSX                           */
  /* ============================= */
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Book Explorer
          </h1>
          <p className="text-gray-600">
            Discover and explore our extensive collection
          </p>
        </div>

        {/* Trending */}
        <HorizontalScrollSection
          title="Trending Books"
          badge={{
            text: "Hot",
            className: "bg-orange-100 text-orange-700",
            icon: null,
          }}
          books={trendingBooks}
          loading={loading.trending}
          showActions={true}
        />

        {/* Recommended */}
        <HorizontalScrollSection
          title="Recommended for You"
          badge={{
            text: "Curated",
            className: "bg-purple-100 text-purple-700",
            icon: null,
          }}
          books={recommendedBooks}
          loading={loading.recommended}
          showActions={true}
        />

        {/* New Arrivals */}
        <HorizontalScrollSection
          title="New Arrivals"
          badge={{
            text: "Fresh",
            className: "bg-teal-100 text-teal-700",
            icon: null,
          }}
          books={newArrivals}
          loading={loading.newArrivals}
          showActions={true}
        />
      </div>
    </div>
  );
};

export default ViewBooksPage;
