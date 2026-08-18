import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Heart,
  Share2,
  ThumbsUp,
  Flag,
  Star,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button, BookCard } from "../components/UIcomponents";
import AuthLoading from '../components/AuthLoading.jsx';
import { DefaultPopup } from '../components/DefaultPopup.jsx';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import api from '../api/axiosInstance.js';
import {getRandomGradientClass} from '../utils/getRandomGradientClass.js';

// Rating Stars Component
function RatingStars({ rating, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        let starClass;
        if (star <= Math.floor(rating)) {
          starClass = 'text-yellow-400 fill-current';
        } else if (star - rating < 1) {
          starClass = 'text-yellow-400 fill-current opacity-50';
        } else {
          starClass = 'text-gray-300';
        }

        return (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${starClass}`}
          />
        );
      })}
    </div>
  );
}

// Review Card Component
function ReviewCard({ review }) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-gray-600" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">{review.name}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <RatingStars rating={review.rating} size="sm" />
                <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <p className="text-left text-gray-700 leading-relaxed mb-3">{review.comment}</p>

          <div className="flex items-center space-x-4 text-sm">
            <button type='button' className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors">
              <ThumbsUp className="w-4 h-4" />
              <span>Helpful ({review.helpful})</span>
            </button>
            <button type='button' className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors">
              <Flag className="w-4 h-4" />
              <span>Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Rating Distribution Component
const RatingDistribution = ({ distribution, totalReviews }) => (
  <div className="space-y-2">
    {[5, 4, 3, 2, 1].map((stars) => {
      const count = distribution[stars] || 0;
      const percentage = (count / totalReviews) * 100;
      return (
        <div key={stars} className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700 w-3">{stars}</span>
          <Star className="w-4 h-4 text-gray-600" />
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gray-800 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
        </div>
      );
    })}
  </div>
);

function ReviewPopup({
  isOpen,
  step,
  rating,
  comment,
  isSubmitting,
  onClose,
  onRatingChange,
  onCommentChange,
  onSubmit,
}) {
  if (!isOpen) return null;

  const isRateStep = step === 'rate';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-900">
          {isRateStep ? 'Rate This Book' : 'Add Your Comment'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isRateStep
            ? 'Please rate this book first, then continue to your comment.'
            : 'Write your comment and submit it for this book.'}
        </p>

        {isRateStep ? (
          <div className="my-8 flex items-center justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onRatingChange(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-10 w-10 ${
                    star <= rating
                      ? 'fill-current text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        ) : (
          <textarea
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            rows={5}
            placeholder="Write your thoughts about this book..."
            className="my-6 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition-colors focus:border-purple-500"
          />
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? 'Saving...'
              : isRateStep
              ? 'Save Rating'
              : 'Submit Comment'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Book Details Page Component
const BookDetailPage = () => {
  const location = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const [bookData, setBookData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [gradientClass] = useState(getRandomGradientClass());
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [reviewStep, setReviewStep] = useState('rate');
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const navigate = useNavigate();

  const [similarBooks, setSimilarBooks] = useState([]);
  const [simPage, setSimPage] = useState(1);
  const [simTotalPages, setSimTotalPages] = useState(1);
  const [simTotal, setSimTotal] = useState(0);
  const [simLoading, setSimLoading] = useState(false);
  const [ratingDistribution, setRatingDistribution] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  });

  const syncCurrentUserReview = (book = null) => {
    setSelectedRating(
      Number(
        book?.my_rating ??
        0
      ) || 0
    );
    setReviewComment(
      book?.my_comment ??
      ''
    );
    setActiveCommentId(
      book?.review_id ??
      null
    );
  };

  const fetchBookDetails = useCallback(async () => {
    try {
      const bookId = location.state?.bookId;

      if (!bookId) {
        setError("No book data found. Please navigate from the book catalog.");
        return null;
      }

      const response = await api.get(
        `/books/${bookId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const fetchedBook = response.data;
        setBookData(fetchedBook);
        setIsLiked(fetchedBook.is_liked || false);
        syncCurrentUserReview(fetchedBook);
        return fetchedBook;
      }

      console.error("Failed to fetch book details");
      setError("No book data found. Please navigate from the book catalog.");
      return null;
    } catch (fetchError) {
      console.error("Failed to load book details", fetchError);
      setError("Failed to load book details.");
      return null;
    }
  }, [location]);

  const fetchComments = useCallback(async (bookId) => {
    try {
      const response = await api.get(
        `/books/${bookId}/comments`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const reviewList = response.data.comments || [];
        setReviews(reviewList);
        return reviewList;
      }

      console.error("Failed to fetch comments");
      return [];
    } catch (fetchError) {
      console.error("Error fetching comments:", fetchError);
      return [];
    }
  }, []);

  const fetchRatingData = useCallback(async (bookId) => {
    try {
      const response = await api.get(
        `/books/${bookId}/rating`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const rating = response.data;
        
        const newRatingDistribution = { 
          5: rating["5stars"], 
          4: rating["4stars"], 
          3: rating["3stars"], 
          2: rating["2stars"], 
          1: rating["1stars"] 
        };
        
        setRatingDistribution(newRatingDistribution);
      } else {
        console.error("Failed to fetch rating");
      }
    } catch (fetchError) {
      console.error("Error fetching rating:", fetchError);
    }
  }, []);

  const refreshReviewData = async () => {
    const bookId = bookData?.book_id || location.state?.bookId;

    if (!bookId) return;

    await Promise.all([
      fetchBookDetails(),
      fetchComments(bookId),
      fetchRatingData(bookId),
    ]);
  };

  useEffect(() => {
    fetchBookDetails();
  }, [fetchBookDetails]);

  const similarScrollRef = useRef(null);

  const scrollSimilar = (direction) => {
    if (similarScrollRef.current) {
      const scrollAmount = 320 * 2; // Scroll 2 books at a time
      similarScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const fetchSimilar = useCallback(async (bookId) => {
    try {
      setSimLoading(true);
      const response = await api.get(`/recommendations/books/${bookId}/similar`, {
        params: { limit: 30 },
        withCredentials: true,
      });
      if (response.status === 200) {
        setSimilarBooks(response.data.recommendations || []);
      }
    } catch (err) {
      console.error("Error fetching similar books:", err);
      setSimilarBooks([]);
    } finally {
      setSimLoading(false);
    }
  }, []);

  useEffect(() => {
    if (bookData?.book_id) {
      fetchRatingData(bookData.book_id);
      fetchComments(bookData.book_id);
      fetchSimilar(bookData.book_id);
    }
  }, [bookData, fetchRatingData, fetchComments, fetchSimilar]);

  const handlewishlist = async (e) =>{
    e.stopPropagation();
    setIsLiked(!isLiked);
    try {
      await api.post(`/books/${bookData.book_id}/like`, { withCredentials: true });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRequestClick = (e) => {
    e.stopPropagation();
    navigate("/requestbook", { state: { book: bookData } });
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    setPopupType('share');
    setIsPopupOpen(true);
  };

  const handleAskQuestion = (e) => {
    e.stopPropagation();
    setPopupType('question');
    setIsPopupOpen(true);
  };

  const handleWriteReview = (e) => {
    e.stopPropagation();
    syncCurrentUserReview(bookData);
    if(bookData?.my_rating){
      setReviewStep('comment');
    } else {
      setReviewStep('rate');
    }
    setIsReviewPopupOpen(true);
  };

  const closeReviewPopup = () => {
    setIsReviewPopupOpen(false);
    setReviewStep('rate');
  };

  const handleReviewPopupSubmit = async () => {
    if (!bookData?.book_id) return;

    if (reviewStep === 'rate') {
      if (!selectedRating) {
        toast.error("Please select a rating first.");
        return;
      }

      setIsSubmittingReview(true);
      try {
        await api.post(
          `/books/${bookData.book_id}/rating`,
          { rating: selectedRating },
          { withCredentials: true }
        );

        toast.success("✅ Book rated successfully!");
        
      } catch (submitError) {
        const errorMessage =
          submitError?.response?.data?.error || submitError?.message || "";

        if (!errorMessage.toLowerCase().includes("already rated")) {
          console.error("Error saving rating:", submitError);
          toast.error("Failed to save rating. Please try again.");
          setIsSubmittingReview(false);
          return;
        }
      }

      await refreshReviewData();
      setReviewStep('comment');
      setIsSubmittingReview(false);
      return;
    }

    if (!reviewComment.trim()) {
      toast.error("Please add a comment before submitting.");

      return;
    }

    setIsSubmittingReview(true);
    try {
      if (activeCommentId) {
        await api.put(
          `/books/${bookData.book_id}/comments/${activeCommentId}`,
          { comment: reviewComment.trim() },
          { withCredentials: true }
        );
      } else {
        await api.post(
          `/books/${bookData.book_id}/comments`,
          { comment: reviewComment.trim() },
          { withCredentials: true }
        );
      }

      toast.success("✅ Book comment submitted successfully!");
      
      await refreshReviewData();
      closeReviewPopup();
    } catch (submitError) {
      console.error("Error saving comment:", submitError);
      toast.error("Failed to save comment. Please try again.");

    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Show error if there's an error
  if (error) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Show loading if bookData is not yet available
  if (!bookData) {
    return (
      <div className="min-h-screen w-full bg-gray-50">
        <AuthLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-8 py-8">
        
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Book Cover Section */}
          <div>
            <div className="rounded-xl overflow-hidden shadow-lg mb-4">
              {bookData.image ? (
                <img
                  // 1. Removed the redundant ternary check here
                  src={bookData.image}
                  alt={bookData.title}
                  // 2. Changed object-cover to object-contain
                  className="w-full h-full object-contain"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "/book.png"; 
                  }}
                />
              ) : (
                <div
                  className={`w-full h-full flex flex-col items-center justify-center text-white font-bold p-4 text-center ${
                    gradientClass
                  }`}
                >
                  <div className="text-lg leading-tight mb-2">{bookData.title}</div>
                  <div className="text-sm opacity-90">{bookData.author}</div>
                </div>
              )}
            </div>
  
              {/* Thumbnail Gallery */}
              <div className="flex space-x-3">
                {[1, 2, 3].map((thumb) => (
                  <div key={thumb} className="w-20 h-24 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all">
                    <BookOpen className="w-6 h-6 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          
          {/* Book Details Section */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{bookData.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {bookData.author}</p>
            
            <div className="flex items-center space-x-2 mb-6">
              <RatingStars rating={Number.parseFloat(bookData.rating) || 0} size="md" />
              <span className="text-lg font-semibold text-gray-900">{Number.parseFloat(bookData.rating) || 0}</span>
              <span className="text-gray-600">({bookData.totalReviews?.toLocaleString() || 0} reviews)</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <span className="text-gray-600 font-medium">Genre:</span>
                <span className="ml-2 text-gray-900">{bookData.genre}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Publication Date:</span>
                <span className="ml-2 text-gray-900">{bookData.date ? new Date(bookData.date).toLocaleDateString() : "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Pages:</span>
                <span className="ml-2 text-gray-900">{bookData.pages}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Language:</span>
                <span className="ml-2 text-gray-900">{bookData.language}</span>
              </div>
            </div>
            
            <div className="mb-6">
              {bookData.status === "Available" ? (
                <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                 ✓ Available
                </span>
              ) : (
                <span className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full font-medium">
                  ✗ Not Available
                </span>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3 mb-8">
              <Button
                onClick={handleRequestClick}
                disabled={bookData?.status === "Not Available"}
                variant="primary"
                className="w-full flex-1"
              >
                <BookOpen className="w-6 h-6" />
                Request Book
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handlewishlist}
                variant="outline" className="flex-1 w-full">
                <Heart className={`w-5 h-5 ${isLiked ? "mr-2 fill-red-500 text-red-500" : "mr-2"}`} />
                  Wishlist
                </Button>
                {/* <button className="border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-900 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </button> */}
                <Button 
                onClick={handleShareClick}
                variant="outline" className="flex-1 w-full">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            
            {/* Summary */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Summary</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{bookData.description}</p>
            </div>
          </div>
        </div>
        
        {/* Similar Books Section - Interactive Horizontal Carousel */}
        {similarBooks.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-7 bg-teal-500 rounded-full"></div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Similar Books You Might Like</h2>
                  <p className="text-sm text-gray-500">
                    {similarBooks.length} related titles based on content similarity
                  </p>
                </div>
              </div>

              {/* Previous (←) and Next (→) Arrow Buttons */}
              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => scrollSimilar('left')}
                  className="w-10 h-10 rounded-xl border border-teal-200 bg-white text-gray-700 hover:bg-teal-500 hover:text-white hover:border-teal-500 flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95"
                  title="Scroll previous similar books"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollSimilar('right')}
                  className="w-10 h-10 rounded-xl border border-teal-200 bg-white text-gray-700 hover:bg-teal-500 hover:text-white hover:border-teal-500 flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95"
                  title="Scroll next similar books"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Horizontal Slider Area */}
            <div className="relative">
              <div
                ref={similarScrollRef}
                className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 pt-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {similarBooks.map((simBook) => (
                  <div key={simBook.book_id} className="w-64 flex-shrink-0">
                    <BookCard book={simBook} showActions={true} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Student Reviews Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Student Reviews</h2>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-900 mb-2">{Number.parseFloat(bookData.rating) || 0}</div>
              <RatingStars rating={Number.parseFloat(bookData.rating) || 0} size="lg" />
              <p className="text-gray-600 mt-2">Based on {(bookData.totalReviews || 0).toLocaleString()} reviews</p>
            </div>
            
            {/* Rating Distribution */}
            <div className="lg:col-span-2">
              <RatingDistribution distribution={ratingDistribution} totalReviews={bookData.totalReviews || 0} />
            </div>
          </div>
          
          {/* Review Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <button type="button"
            onClick={handleWriteReview}
            className="bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition-colors">
              Write a Review
            </button>
            <button type='button' onClick={handleAskQuestion} 
            className="border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-900 py-3 rounded-lg font-semibold transition-colors">
              Ask a Question
            </button>
          </div>
          
          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p className="text-gray-600 text-center">No reviews yet. Be the first to review this book!</p>
           ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
           )}

          
          <div className="text-center mt-8">
            <button type='button' className="text-purple-600 hover:text-purple-700 font-semibold">
              Load More Reviews
            </button>
          </div>
          <ReviewPopup
            isOpen={isReviewPopupOpen}
            step={reviewStep}
            rating={selectedRating}
            comment={reviewComment}
            isSubmitting={isSubmittingReview}
            onClose={closeReviewPopup}
            onRatingChange={setSelectedRating}
            onCommentChange={setReviewComment}
            onSubmit={handleReviewPopupSubmit}
          />
          {isPopupOpen && (
            <DefaultPopup
              isOpen={isPopupOpen}
              onClose={() => {
                setIsPopupOpen(false);
                setPopupType(null);
              }}
              title={popupType === 'share' ? 'Share' : 'Ask a Question'}
            />)}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
