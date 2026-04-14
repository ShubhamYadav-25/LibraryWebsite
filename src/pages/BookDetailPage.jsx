import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Heart,
  Share2,
  ThumbsUp,
  Flag,
  Star,
  User,
  View
} from 'lucide-react';
import { Button } from "../components/UIcomponents";
import { useNavigate } from "react-router-dom";
import { DefaultPopup } from '../components/DefaultPopup.jsx';

const tailwindColors = [
    'red-400', 'red-500', 'red-600',
    'blue-400', 'blue-500', 'blue-600',
    'green-400', 'green-500', 'green-600',
    'purple-400', 'purple-500', 'purple-600',
    'pink-400', 'pink-500', 'pink-600',
    'yellow-400', 'yellow-500', 'yellow-600',
    'teal-400', 'teal-500', 'teal-600',
    'indigo-400', 'indigo-500', 'indigo-600',
    'orange-400', 'orange-500', 'orange-600',
    'fuchsia-400', 'fuchsia-500', 'fuchsia-600'
];

const gradientDirections = [
    'to-t', 'to-tr', 'to-r', 'to-br',
    'to-b', 'to-bl', 'to-l', 'to-tl'
];

function getRandomGradientClass() {
    // Helper function to pick a random item from an array.
    const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const direction = getRandomItem(gradientDirections);
    const fromColor = getRandomItem(tailwindColors);
    let viaColor = getRandomItem(tailwindColors);
    let toColor = getRandomItem(tailwindColors);

    while (viaColor === fromColor) {
        viaColor = getRandomItem(tailwindColors);
    }
    while (toColor === fromColor || toColor === viaColor) {
        toColor = getRandomItem(tailwindColors);
    }

    return `bg-gradient-${direction} from-${fromColor} via-${viaColor} to-${toColor}`;
}
// Rating Stars Component
function RatingStars({ rating, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= Math.floor(rating)
              ? 'text-yellow-400 fill-current'
              : star - rating < 1
              ? 'text-yellow-400 fill-current opacity-50'
              : 'text-gray-300'
          }`}
        />
      ))}
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
              <h4 className="font-semibold text-gray-900">{review.studentName}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <RatingStars rating={review.rating} size="sm" />
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
            </div>
          </div>

          <p className="text-left text-gray-700 leading-relaxed mb-3">{review.comment}</p>

          <div className="flex items-center space-x-4 text-sm">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors">
              <ThumbsUp className="w-4 h-4" />
              <span>Helpful ({review.helpful})</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors">
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

// Main Book Details Page Component
const BookDetailPage = () => {
  const location = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const [bookData, setBookData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [gradientClass] = useState(getRandomGradientClass());
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  const [ratingDistribution, setRatingDistribution] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  });

  useEffect(() => {
  const fetchBook = async () => {
    try {
      const bookId = location.state?.bookId;

      if (bookId) {
        const response = await fetch(
          `http://localhost:5000/books/${bookId}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
          }
        );

        if (response.ok) {
          const bookData = await response.json();
          setBookData(bookData);
          setIsLiked(bookData.is_liked || false);
        } else {
          setError("No book data found. Please navigate from the book catalog.");
        }
      }
    } catch (error) {
      setError("Failed to load book details.");
      console.error("Failed to fetch book details", error);
    }
  };

  fetchBook();
}, [location.state]);

  useEffect(() => {
    const getcomments = async() => {
      try {
        const response = await fetch(
          `http://localhost:5000/books/${bookData.book_id}/comments`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
          }
        );

        if (response.ok) {
          const review = await response.json();
          // console.log("Comments:", review);
          setReviews(review);
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    const getrating = async() => {
      try {
        const response = await fetch(
          `http://localhost:5000/books/${bookData.book_id}/rating`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
          }
        );

        if (response.ok) {
          const rating = await response.json();
          // console.log(rating);
          const newRatingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          rating.map((item) => {
            newRatingDistribution[item.stars] = item.count;
          });
          setRatingDistribution(newRatingDistribution);
          // console.log(ratingDistribution);
        } else {
          console.error("Failed to fetch rating");
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
      }
    };

    if (bookData && bookData.book_id) {
      getrating();
      getcomments();
    }
  }, [bookData]);

  const handlewishlist = async (e) =>{
    e.stopPropagation();
    setIsLiked(!isLiked);
    try {
      await fetch(`http://localhost:5000/books/${bookData.book_id}/like`, {
      method: "POST",
      credentials: "include", // if cookies/session used
      headers: { "Content-Type": "application/json" }
    });
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
    setIsPopupOpen(true);
  };

  const handleAskQuestion = (e) => {
    e.stopPropagation();
    setIsPopupOpen(true);
  };

  const handleWriteReview = (e)=>{
    e.stopPropagation();
    setIsPopupOpen(true);
  }

  // Show error if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Book Cover Section */}
          <div>
            <div className="aspect-[3/4] bg-gray-200 rounded-xl overflow-hidden shadow-lg mb-4">
              {bookData.image ? (
              <img
                src={`http://localhost:5000/bookimages/${bookData.image}`}
                alt={bookData.title}
                className="w-full h-full object-cover"
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
              <RatingStars rating={parseFloat(bookData.rating) || 0} size="md" />
              <span className="text-lg font-semibold text-gray-900">{parseFloat(bookData.rating) || 0}</span>
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
              <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                ✓ {bookData.status}
              </span>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3 mb-8">
              <Button onClick={handleRequestClick} disabled={bookData.status === "Not Available"}
                variant="primary" className="w-full flex-1">
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
        
        {/* Student Reviews Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Student Reviews</h2>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-900 mb-2">{parseFloat(bookData.rating) || 0}</div>
              <RatingStars rating={parseFloat(bookData.rating) || 0} size="lg" />
              <p className="text-gray-600 mt-2">Based on {(bookData.totalReviews || 0).toLocaleString()} reviews</p>
            </div>
            
            {/* Rating Distribution */}
            <div className="lg:col-span-2">
              <RatingDistribution distribution={ratingDistribution} totalReviews={bookData.totalReviews} />
            </div>
          </div>
          
          {/* Review Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <button 
            onClick={handleWriteReview}
            className="bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition-colors">
              Write a Review
            </button>
            <button onClick={handleAskQuestion} 
            className="border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-900 py-3 rounded-lg font-semibold transition-colors">
              Ask a Question
            </button>
          </div>
          
          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button className="text-purple-600 hover:text-purple-700 font-semibold">
              Load More Reviews
            </button>
          </div>
          {isPopupOpen && (
            <DefaultPopup
              isOpen={isPopupOpen}
              onClose={() => {
                setIsPopupOpen(false);
                setPopupType(null);
              }}
              title="Coming Soon"
              message="This feature will be integrated soon."
            />)}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;