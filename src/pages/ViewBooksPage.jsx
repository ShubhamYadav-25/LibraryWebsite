import {
  useState,
  useEffect,
  useCallback,
  useRef
} from "react";
import api from "../api/axiosInstance";
import {HorizontalScrollSection} from '../components/UIcomponents';


const ViewBooksPage = () => {
  /* ============================= */
  /* Section States                */
  /* ============================= */
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  const [pageTrending, setPageTrending] = useState(1);
  const [pageRecommended, setPageRecommended] = useState(1);
  const [pageNew, setPageNew] = useState(1);

  const limit = 16;

  const [hasMoreTrending, setHasMoreTrending] = useState(true);
  const [hasMoreRecommended, setHasMoreRecommended] = useState(true);
  const [hasMoreNew, setHasMoreNew] = useState(true);

  const [loading, setLoading] = useState({
    trending: false,
    recommended: false,
    newArrivals: false,
  });

  const fetchBooks = useCallback(
    async (section, apiUrl, pageNum) => {
      try {
        setLoading((prev) => ({ ...prev, [section]: true }));

        const res = await api.get(apiUrl, {
          params: { page: pageNum, limit },
          withCredentials: true,
        });

        if (res.status === 200 && res.data.books) {
          const newBooks = res.data.books;

          /* Handle hasMore */
          if (newBooks.length < limit) {
            if (section === "trending") setHasMoreTrending(false);
            if (section === "recommended") setHasMoreRecommended(false);
            if (section === "newArrivals") setHasMoreNew(false);
          }

          /* Append Data */
          if (section === "trending") {
            setTrendingBooks((prev) => [...prev, ...newBooks]);
          }

          if (section === "recommended") {
            setRecommendedBooks((prev) => [...prev, ...newBooks]);
          }

          if (section === "newArrivals") {
            setNewArrivals((prev) => [...prev, ...newBooks]);
          }
        }
      } catch (err) {
        console.error(`Error fetching ${section} books:`, err);
      } finally {
        setLoading((prev) => ({ ...prev, [section]: false }));
      }
    },
    [limit]
  );


  useEffect(() => {
    fetchBooks("trending", `/books/trending`, 1);
    fetchBooks("recommended", `/books`, 1);  //later change to /books/recommended
    fetchBooks("newArrivals", `/books/new-arrivals`, 1);
  }, [fetchBooks]);


  const trendingRef = useRef(null);
  const recommendedRef = useRef(null);
  const newRef = useRef(null);

  useEffect(() => {
    const observerTrending = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasMoreTrending &&
        !loading.trending
      ) {
        setPageTrending((prev) => {
          const next = prev + 1;
          fetchBooks("trending", `/books/trending`, next);
          return next;
        });
      }
    });

    const observerRecommended = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasMoreRecommended &&
        !loading.recommended
      ) {
        setPageRecommended((prev) => {
          const next = prev + 1;
          fetchBooks("recommended", `/books`, next);
          return next;
        });
      }
    });

    const observerNew = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasMoreNew &&
        !loading.newArrivals
      ) {
        setPageNew((prev) => {
          const next = prev + 1;
          fetchBooks("newArrivals", `/books/new-arrivals`, next);
          return next;
        });
      }
    });

    if (trendingRef.current) observerTrending.observe(trendingRef.current);
    if (recommendedRef.current)
      observerRecommended.observe(recommendedRef.current);
    if (newRef.current) observerNew.observe(newRef.current);

    return () => {
      observerTrending.disconnect();
      observerRecommended.disconnect();
      observerNew.disconnect();
    };
  }, [
    fetchBooks,
    hasMoreTrending,
    hasMoreRecommended,
    hasMoreNew,
    loading.trending,
    loading.recommended,
    loading.newArrivals,
  ]);

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
          showActions={false}
        />
        {loading.trending && (
          <p className="text-center text-gray-500">Loading more...</p>
        )}
        <div ref={trendingRef} style={{ height: 30 }} />

        {/* Recommended */}
        <HorizontalScrollSection
          title="Recommended for You"
          badge={{
            text: "Curated",
            className: "bg-purple-100 text-purple-700",
            icon: null,
          }}
          books={recommendedBooks}
          showActions={true}
        />
        {loading.recommended && (
          <p className="text-center text-gray-500">Loading more...</p>
        )}
        <div ref={recommendedRef} style={{ height: 30 }} />

        {/* New Arrivals */}
        <HorizontalScrollSection
          title="New Arrivals"
          badge={{
            text: "Fresh",
            className: "bg-teal-100 text-teal-700",
            icon: null,
          }}
          books={newArrivals}
          showActions={false}
        />
        {loading.newArrivals && (
          <p className="text-center text-gray-500">Loading more...</p>
        )}
        <div ref={newRef} style={{ height: 30 }} />
      </div>
    </div>
  );
};

export default ViewBooksPage;
